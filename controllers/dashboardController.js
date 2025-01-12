const User = require('../models/User');

exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('roles');
    res.json({ message: 'This is the dashboard data', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};