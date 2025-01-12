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
const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - nombre
 *         - permisos
 *       properties:
 *         nombre:
 *           type: string
 *           description: The role name
 *         permisos:
 *           type: array
 *           items:
 *             type: string
 *           description: The IDs of the permissions associated with the role
 *       example:
 *         nombre: "Director"
 *         permisos: ["60d0fe4f5311236168a109ca", "60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc"]
 */
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management
 */
/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: The role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Some server error
 */
router.post('/', auth, authorize(['manage_roles']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, permisos } = req.body;
    try {
        const newRole = new Role({ nombre, permisos });
        yield newRole.save();
        res.status(201).json(newRole);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Returns the list of all the roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: The list of the roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get('/', auth, authorize(['view_roles']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role.find().populate('permisos');
        res.status(200).json(roles);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role by id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: The role was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: The role was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', auth, authorize(['manage_roles']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, permisos } = req.body;
    try {
        const updatedRole = yield Role.findByIdAndUpdate(req.params.id, { nombre, permisos }, { new: true });
        if (!updatedRole)
            return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(updatedRole);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Remove a role by id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role was deleted
 *       404:
 *         description: The role was not found
 */
router.delete('/:id', auth, authorize(['manage_roles']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRole = yield Role.findByIdAndDelete(req.params.id);
        if (!deletedRole)
            return res.status(404).json({ message: 'Role not found' });
        res.status(200).json({ message: 'Role deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
module.exports = router;
