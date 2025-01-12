const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email }).populate('roles');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.contraseña);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Incluir roles en el token
    const token = jwt.sign({
      _id: user._id,
      roles: user.roles.map(role => role.nombre)
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.header('Authorization', token).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    console.log('Forgot password request for:', email);

    // Find user by email field
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000
    });

    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error('Missing email configuration');
      return res.status(500).json({ message: 'Error de configuración de correo' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Use email from user model
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Recuperación de Contraseña',
      text: `
        Has solicitado restablecer tu contraseña.
        
        Por favor haz clic en el siguiente enlace para completar el proceso:
        
        ${process.env.FRONTEND_URL}/reset/${token}
        
        Si no solicitaste esto, ignora este correo.
      `
    };

    console.log('Sending email to:', user.email);
    await transporter.sendMail(mailOptions);
    console.log('Recovery email sent to:', user.email);
    
    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ 
      message: 'Error al enviar correo de recuperación',
      error: error.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    user.contraseña = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};