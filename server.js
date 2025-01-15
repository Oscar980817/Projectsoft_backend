require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const dailyActivityRoutes = require('./routes/dailyActivity'); // Importar rutas de actividades diarias
const dailyReportRoutes = require('./routes/dailyReport'); // Importar rutas de reportes diarios
const dashboardRoutes = require('./routes/dashboard'); // Importar rutas del dashboard
const civRoutes = require('./routes/civ');
const roleRoutes = require('./routes/role'); // Importar rutas de roles
const permissionRoutes = require('./routes/permission'); // Importar rutas de permisos
const messageRoutes = require('./routes/message.js');
const notificationRoutes = require('./routes/notification');
const photoRoutes = require('./routes/photo');
const configureSwagger = require('./swagger');

const app = express();

// Configurar CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://projectsoft-132e0.web.app',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept', 
    'X-Requested-With',
    'x-user-id',
    'x-user-role'
  ],
  exposedHeaders: ['x-user-id', 'x-user-role'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://projectsoft-132e0.web.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

mongoose.connect(process.env.DB_CONNECTION, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/activities', dailyActivityRoutes); // Incluir las rutas de actividades diarias
app.use('/daily-reports', dailyReportRoutes); // Incluir las rutas de reportes diarios
app.use('/', dashboardRoutes); // Incluir las rutas del dashboard
app.use('/civs', civRoutes);
app.use('/roles', roleRoutes); // Usar rutas de roles
app.use('/permissions', permissionRoutes); // Usar rutas de permisos
app.use('/api', messageRoutes); // Asegúrate de usar messageRoutes
app.use('/api', notificationRoutes);
app.use('/photos', photoRoutes);

configureSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});