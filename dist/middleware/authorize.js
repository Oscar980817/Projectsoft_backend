"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Role = require('../models/Role');
const authorize = (requiredPermissions) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ message: 'Access denied. No roles provided.' });
        }
        try {
            const userRoles = yield Role.find({ _id: { $in: req.user.roles } }).populate('permisos');
            const userPermissions = userRoles.flatMap(role => role.permisos.map(permiso => permiso.nombre));
            const hasRequiredPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
            if (!hasRequiredPermission) {
                return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};
module.exports = authorize;
