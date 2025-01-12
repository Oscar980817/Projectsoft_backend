const mongoose = require('mongoose');
const DailyActivity = require('../models/DailyActivity');
const multer = require('multer');
const path = require('path');

// Configurar multer para almacenar archivos en el directorio 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

exports.createActivity = [
  upload.single('fotografia'), // Middleware de multer para manejar la carga de archivos
  async (req, res) => {
    const { civ, ubi_inicial, ubi_final, item, actividad, largo, ancho, alto, descuento_largo, descuento_ancho, descuento_alto, observaciones } = req.body;
    const fotografia = req.file ? req.file.path : req.body.fotografia; // Manejar tanto archivo como string

    try {
      const total = largo * ancho * alto;
      const total_descuento = descuento_largo * descuento_ancho * descuento_alto;
      const total_final = total - total_descuento;

      const newActivity = new DailyActivity({
        civ: new mongoose.Types.ObjectId(civ), // Asegúrate de que civ es un ObjectId
        ubi_inicial,
        ubi_final,
        item,
        actividad,
        largo,
        ancho,
        alto,
        total,
        descuento_largo,
        descuento_ancho,
        descuento_alto,
        total_descuento,
        total_final,
        fotografia,
        observaciones,
        createdBy: req.user._id, // Usar el ID del usuario autenticado
        cargo: req.user.roles.map(role => role.nombre).join(', ') // Usar los roles del usuario autenticado
      });

      await newActivity.save();
      res.status(201).json({ id: newActivity._id });
    } catch (error) {
      console.error('Error al crear actividad:', error);
      res.status(500).json({ message: error.message });
    }
  }
];

exports.updateActivity = [
  upload.single('fotografia'),
  async (req, res) => {
    const { id } = req.params;
    try {
      // Si solo estamos actualizando informeGenerado
      if (req.body.informeGenerado !== undefined && Object.keys(req.body).length === 1) {
        console.log('Actualizando informeGenerado para actividad:', id);
        const updatedActivity = await DailyActivity.findByIdAndUpdate(
          id,
          { informeGenerado: req.body.informeGenerado },
          { new: true }
        );
        
        if (!updatedActivity) {
          console.log('Actividad no encontrada:', id);
          return res.status(404).json({ message: 'Activity not found' });
        }
        
        return res.status(200).json(updatedActivity);
      }

      // Si estamos actualizando todos los campos
      const { 
        civ, 
        ubi_inicial, 
        ubi_final, 
        item, 
        actividad, 
        largo, 
        ancho, 
        alto, 
        descuento_largo, 
        descuento_ancho, 
        descuento_alto, 
        observaciones 
      } = req.body;
      
      const fotografia = req.file ? req.file.path : req.body.fotografia;

      const total = largo * ancho * alto;
      const total_descuento = descuento_largo * descuento_ancho * descuento_alto;
      const total_final = total - total_descuento;

      const updatedActivity = await DailyActivity.findByIdAndUpdate(
        id,
        {
          civ: civ ? new mongoose.Types.ObjectId(civ) : undefined,
          ubi_inicial,
          ubi_final,
          item,
          actividad,
          largo,
          ancho,
          alto,
          total,
          descuento_largo,
          descuento_ancho,
          descuento_alto,
          total_descuento,
          total_final,
          fotografia,
          observaciones,
          createdBy: req.user._id,
          cargo: req.user.roles.map(role => role.nombre).join(', ')
        },
        { new: true }
      );

      if (!updatedActivity) {
        console.log('Actividad no encontrada en actualización completa:', id);
        return res.status(404).json({ message: 'Activity not found' });
      }
      
      console.log('Actividad actualizada exitosamente:', id);
      res.status(200).json(updatedActivity);
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      res.status(500).json({ 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
];

exports.getActivities = async (req, res) => {
  try {
    const activities = await DailyActivity.find().populate('civ').populate('createdBy');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await DailyActivity.findById(id).populate('civ').populate('createdBy');
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedActivity = await DailyActivity.findByIdAndDelete(id);
    if (!deletedActivity) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};