const Role = require('../models/Role');

const authorize = (requiredPermissions) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Access denied. No roles provided.' });
    }

    try {
      const userRoles = await Role.find({ _id: { $in: req.user.roles } }).populate('permisos');
      const userPermissions = userRoles.flatMap(role => role.permisos.map(permiso => permiso.nombre));

      const hasRequiredPermission = requiredPermissions.some(permission => userPermissions.includes(permission));

      if (!hasRequiredPermission) {
        return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = authorize;