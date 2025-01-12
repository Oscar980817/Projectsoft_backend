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
const Permission = require('../models/Permission');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           description: The permission name
 *       example:
 *         nombre: "manage_roles"
 */
/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management
 */
/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: The permission was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Some server error
 */
router.post('/', auth, authorize(['manage_permissions']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre } = req.body;
    try {
        const newPermission = new Permission({ nombre });
        yield newPermission.save();
        res.status(201).json(newPermission);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Returns the list of all the permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: The list of the permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
router.get('/', auth, authorize(['view_permissions']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield Permission.find();
        res.status(200).json(permissions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission by id
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The permission id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: The permission was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: The permission was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', auth, authorize(['manage_permissions']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre } = req.body;
    try {
        const updatedPermission = yield Permission.findByIdAndUpdate(req.params.id, { nombre }, { new: true });
        if (!updatedPermission)
            return res.status(404).json({ message: 'Permission not found' });
        res.status(200).json(updatedPermission);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Remove a permission by id
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The permission id
 *     responses:
 *       200:
 *         description: The permission was deleted
 *       404:
 *         description: The permission was not found
 */
router.delete('/:id', auth, authorize(['manage_permissions']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPermission = yield Permission.findByIdAndDelete(req.params.id);
        if (!deletedPermission)
            return res.status(404).json({ message: 'Permission not found' });
        res.status(200).json({ message: 'Permission deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
module.exports = router;
