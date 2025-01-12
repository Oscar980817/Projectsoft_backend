const DailyReport = require('../models/DailyReport');
const DailyActivity = require('../models/DailyActivity');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const PDFDocument = require('pdfkit');
const getFullImagePath = (fotografia) => {
  if (!fotografia) return null;
  return `/uploads/${fotografia}`;
};


exports.createReport = async (req, res) => {
  try {
    const { date, summary, activities } = req.body;
    const report = new DailyReport({
      date,
      summary,
      activities,
      createdBy: req.user._id
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await DailyReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id)
      .populate({
        path: 'activities',
        populate: {
          path: 'civ',
          model: 'CIV'
        }
      })
      .populate('createdBy', 'nombre')
      .populate('approvedBy', 'nombre');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Process activities to include full image paths
    const processedReport = {
      ...report.toObject(),
      activities: report.activities.map(activity => ({
        ...activity,
        fotografia: activity.fotografia ? getFullImagePath(activity.fotografia) : null
      }))
    };

    res.status(200).json(processedReport);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id)
      .populate('createdBy', 'nombre')
      .populate('approvedBy', 'nombre');

    if (!report) return res.status(404).json({ message: 'Informe no encontrado' });

    // Check if status is changing from rejected to pending
    const isStatusChanging = report.status === 'rejected' && req.body.status === 'pending';

    // Update report
    Object.assign(report, req.body);
    await report.save();

    // Update activities
    if (req.body.activities) {
      for (const activity of req.body.activities) {
        await DailyActivity.findByIdAndUpdate(activity._id, activity, { new: true });
      }
    }

    // Send notification if status changed from rejected to pending
    if (isStatusChanging && report.approvedBy) {
      try {
        // Create notification for the reviewer
        const notification = new Notification({
          estado: 'Actualizado',
          usuario: report.approvedBy._id,
          mensaje: `El informe del ${new Date(report.date).toLocaleDateString()} ha sido actualizado y está pendiente de revisión.`
        });
        await notification.save();

        // Create message
        const message = new Message({
          reportId: report._id,
          remitente: report.createdBy._id,
          destinatario: report.approvedBy._id,
          asunto: 'Informe Actualizado',
          descripcion: `El informe del ${new Date(report.date).toLocaleDateString()} ha sido actualizado y está pendiente de revisión.`,
          fecha_de_programa: new Date()
        });
        await message.save();
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    // Return updated report
    const updatedReport = await DailyReport.findById(report._id)
      .populate('activities')
      .populate('createdBy', 'nombre')
      .populate('approvedBy', 'nombre');

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Error al actualizar el informe' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if report can be deleted (only pending reports)
    if (report.status !== 'pending') {
      return res.status(400).json({
        message: 'Cannot delete a report that has been approved or rejected'
      });
    }

    await DailyReport.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveReport = async (req, res) => {
  try {
    console.log('Approving report with ID:', req.params.id);
    console.log('User making request:', req.user);

    const report = await DailyReport.findById(req.params.id)
      .populate('createdBy', 'nombre')
      .populate('approvedBy', 'nombre');

    if (!report) {
      console.log('Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if report is already approved or rejected
    if (report.status === 'approved') {
      return res.status(400).json({ message: 'Report is already approved' });
    }

    if (report.status === 'rejected') {
      return res.status(400).json({ message: 'Report is already rejected' });
    }

    report.status = 'approved';
    report.approvedBy = req.user._id;
    report.approvedAt = new Date();

    await report.save();
    console.log('Report saved successfully');

    // Create notification for report creator
    try {
      const notification = new Notification({
        estado: 'Aprobado',
        usuario: report.createdBy._id, // Use _id from populated createdBy
        mensaje: `El informe del ${new Date(report.date).toLocaleDateString()} ha sido aprobado`
      });
      await notification.save();
      console.log('Notification created successfully');
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue execution even if notification fails
    }

    // Populate the report again to get full user details
    const populatedReport = await DailyReport.findById(report._id)
      .populate('createdBy', 'nombre')
      .populate('approvedBy', 'nombre')
      .populate('activities');

    res.status(200).json(populatedReport);
  } catch (error) {
    console.error('Error in approveReport:', error);
    res.status(500).json({
      message: 'Error approving report',
      error: error.message
    });
  }
};

exports.rejectReport = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({ 
        message: 'El motivo de rechazo es requerido',
        code: 'REJECTION_REASON_REQUIRED'
      });
    }

    const report = await DailyReport.findById(req.params.id)
      .populate('createdBy', 'nombre email')
      .populate('approvedBy', 'nombre');

    if (!report) {
      return res.status(404).json({ 
        message: 'Informe no encontrado',
        code: 'REPORT_NOT_FOUND' 
      });
    }

    // Verificar si el informe ya está procesado
    if (report.status === 'approved' || report.status === 'rejected') {
      return res.status(400).json({ 
        message: 'El informe ya ha sido procesado',
        code: 'REPORT_ALREADY_PROCESSED'
      });
    }

    // Actualizar el informe
    report.status = 'rejected';
    report.approvedBy = req.user._id;
    report.approvedAt = new Date();
    report.rejectionReason = rejectionReason.trim();

    await report.save();

    // Crear notificación
    try {
      const notification = new Notification({
        estado: 'Rechazado',
        usuario: report.createdBy._id,
        mensaje: `El informe del ${new Date(report.date).toLocaleDateString()} ha sido rechazado. Motivo: ${rejectionReason}`
      });
      await notification.save();
    } catch (notificationError) {
      console.error('Error al crear notificación:', notificationError);
    }

    // Crear mensaje
    try {
      const message = new Message({
        reportId: report._id, // Agregar reportId
        remitente: req.user._id,
        destinatario: report.createdBy._id,
        asunto: 'Informe Diario Rechazado',
        descripcion: `El informe del ${new Date(report.date).toLocaleDateString()} ha sido rechazado. Motivo: ${rejectionReason}`,
        fecha_de_programa: new Date(),
        documento: ''
      });
      await message.save();
    } catch (messageError) {
      console.error('Error al crear mensaje:', messageError);
    }

    res.status(200).json({
      message: 'Informe rechazado exitosamente',
      report: {
        id: report._id,
        status: report.status,
        rejectionReason: report.rejectionReason,
        date: report.date,
        createdBy: report.createdBy.nombre,
        approvedBy: req.user.nombre
      }
    });

  } catch (error) {
    console.error('Error al rechazar informe:', error);
    res.status(500).json({ 
      message: 'Error interno al rechazar el informe',
      error: error.message 
    });
  }
};

exports.generateReportPDF = async (req, res) => {
  try {
    // Get report with populated activities first
    const report = await DailyReport.findById(req.params.id)
      .populate({
        path: 'activities',
        populate: {
          path: 'civ',
          model: 'CIV',
          select: 'numero descripcion'
        }
      })
      .populate('createdBy', 'nombre')
      .populate('approvedBy', 'nombre');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Get activities with populated CIV data
    const activities = await DailyActivity.find({
      _id: { $in: report.activities.map(a => a._id) }
    }).populate('civ');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=informe_${new Date(report.date).toLocaleDateString().replace(/\//g, '-')}.pdf`);

    doc.pipe(res);

    // Header page
    doc.fontSize(25).text('Informe Diario', { align: 'center' });
    doc.moveDown();

    // Report Details
    doc.rect(50, doc.y, 500, 120).stroke();
    doc.fontSize(12);
    let yPosition = doc.y + 10;

    doc.fillColor('black').text(`Fecha: ${new Date(report.date).toLocaleDateString()}`, 60, yPosition);
    yPosition += 20;
    doc.fillColor('black').text(`Creado por: ${report.createdBy?.nombre || 'N/A'}`, 60, yPosition);
    yPosition += 20;
    doc.fillColor('black').text(`Estado: ${report.status}`, 60, yPosition);

    if (report.approvedBy) {
      yPosition += 20;
      doc.fillColor('black').text(`Aprobado por: ${report.approvedBy.nombre}`, 60, yPosition);
      yPosition += 20;
      doc.fillColor('black').text(`Fecha de aprobación: ${new Date(report.approvedAt).toLocaleDateString()}`, 60, yPosition);
    }

    doc.y = yPosition + 40;

    // Summary section
    doc.fontSize(14).fillColor('black').text('Resumen:', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(report.summary || 'Sin resumen');
    doc.moveDown();

    // Activities Section - One activity per page
    if (report.activities && report.activities.length > 0) {
      for (const [index, activity] of report.activities.entries()) {
        try {
          // New page for each activity
          doc.addPage();
          doc.fontSize(14).fillColor('black').text(`Actividad ${index + 1}:`, { underline: true });
          doc.moveDown();

          // Activity details with reduced spacing
          doc.fontSize(12).fillColor('black');
          doc.text(`CIV: ${activity.civ ? activity.civ.numero : 'N/A'}`);
          doc.text(`Descripción: ${activity.actividad || 'N/A'}`);
          doc.text(`Ubicación Inicial: ${activity.ubi_inicial || 'N/A'}`);
          doc.text(`Ubicación Final: ${activity.ubi_final || 'N/A'}`);
          doc.text(`Item: ${activity.item || 'N/A'}`);
          doc.moveDown();

          // Measurements
          doc.text('Medidas:', { underline: true });
          doc.text(`  - Largo: ${activity.largo || '0'} m`);
          doc.text(`  - Ancho: ${activity.ancho || '0'} m`);
          doc.text(`  - Alto: ${activity.alto || '0'} m`);
          doc.text(`Total: ${activity.total || '0'} m³`);
          doc.moveDown();

          // Discounts
          doc.text('Descuentos:', { underline: true });
          doc.text(`  - Largo: ${activity.descuento_largo || '0'} m`);
          doc.text(`  - Ancho: ${activity.descuento_ancho || '0'} m`);
          doc.text(`  - Alto: ${activity.descuento_alto || '0'} m`);
          doc.text(`Total Descuento: ${activity.total_descuento || '0'} m³`);
          doc.text(`Total Final: ${activity.total_final || '0'} m³`, { bold: true });
          doc.moveDown();

          if (activity.observaciones) {
            doc.text('Observaciones:', { underline: true });
            doc.text(activity.observaciones);
            doc.moveDown();
          }

          // Use populated CIV data
          const civData = activities.find(a => a._id.toString() === activity._id.toString())?.civ;
          doc.fontSize(12).fillColor('black');

          // Add activity image
          if (activity.fotografia) {
            try {
              // Calculate remaining space
              const imgHeight = 150; // Reduced height
              doc.image(activity.fotografia, {
                fit: [300, imgHeight], // Reduced width
                align: 'center'
              });
            } catch (imageError) {
              console.error('Error adding image:', imageError);
              doc.text('Error al cargar la imagen');
            }
          }

        } catch (activityError) {
          console.error(`Error processing activity ${index}:`, activityError);
          doc.fillColor('black').text(`Error al procesar actividad ${index + 1}`);
        }
      }
    } else {
      doc.fillColor('black').text('No hay actividades registradas');
    }

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: error.message });
  }
};