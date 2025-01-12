const Message = require('../models/Message');
const Notification = require('../models/Notification');

const createOrUpdateMessage = async (req, res) => {
  try {
    const { reportId, remitente, destinatario, asunto, descripcion } = req.body;

    const message = new Message({
      reportId,
      remitente,
      destinatario,
      asunto,
      descripcion,
      fecha_de_programa: new Date(),
      documento: ''
    });

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error al crear el mensaje' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('remitente', 'nombre')
      .populate('destinatario', 'nombre')
      .sort({ fecha_de_programa: -1 });

    // Group messages by reportId
    const groupedMessages = messages.reduce((acc, message) => {
      if (!acc[message.reportId]) {
        acc[message.reportId] = [];
      }
      acc[message.reportId].push(message);
      return acc;
    }, {});

    res.status(200).json(groupedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error al obtener los mensajes' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { estado, usuario } = req.body;
    const newNotification = new Notification({
      estado,
      usuario
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('estado usuario');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateMessage,
  getMessages,
  createNotification,
  getNotifications
};