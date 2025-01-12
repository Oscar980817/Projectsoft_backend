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
router.post('/', auth, authorize(['manage_permissions']), async (req, res) => {
  const { nombre } = req.body;

  try {
    const newPermission = new Permission({ nombre });
    await newPermission.save();
    res.status(201).json(newPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
router.get('/', auth, authorize(['view_permissions']), async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
router.put('/:id', auth, authorize(['manage_permissions']), async (req, res) => {
  const { nombre } = req.body;

  try {
    const updatedPermission = await Permission.findByIdAndUpdate(req.params.id, { nombre }, { new: true });
    if (!updatedPermission) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json(updatedPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
router.delete('/:id', auth, authorize(['manage_permissions']), async (req, res) => {
  try {
    const deletedPermission = await Permission.findByIdAndDelete(req.params.id);
    if (!deletedPermission) return res.status(404).json({ message: 'Permission not found' });
    res.status(200).json({ message: 'Permission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;