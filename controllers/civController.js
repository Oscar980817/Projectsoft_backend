const Civ = require('../models/Civ');

exports.getCivs = async (req, res) => {
  try {
    const civs = await Civ.find().sort({ numero: 1 });
    res.status(200).json(civs);
  } catch (error) {
    console.error('Error fetching CIVs:', error);
    res.status(500).json({ message: 'Error al obtener CIVs' });
  }
};

exports.createCiv = async (req, res) => {
  const { numero } = req.body;

  try {
    const newCiv = new Civ({ numero });
    await newCiv.save();
    res.status(201).json(newCiv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCiv = async (req, res) => {
  try {
    const deletedCiv = await Civ.findByIdAndDelete(req.params.id);
    if (!deletedCiv) return res.status(404).json({ message: 'CIV not found' });
    res.status(200).json({ message: 'CIV deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};