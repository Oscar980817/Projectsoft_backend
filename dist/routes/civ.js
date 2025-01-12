"use strict";
const express = require('express');
const router = express.Router();
const civController = require('../controllers/civController');
const auth = require('../middleware/auth');
/**
 * @swagger
 * components:
 *   schemas:
 *     Civ:
 *       type: object
 *       required:
 *         - numero
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the CIV
 *         numero:
 *           type: string
 *           description: Número del CIV
 *       example:
 *         id: d5fE_asz
 *         numero: "12345"
 */
/**
 * @swagger
 * tags:
 *   name: Civs
 *   description: CIV management
 */
/**
 * @swagger
 * /civs:
 *   get:
 *     summary: Get all CIVs
 *     tags: [Civs]
 *     responses:
 *       200:
 *         description: List of all CIVs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Civ'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', auth, civController.getCivs);
/**
 * @swagger
 * /civs:
 *   post:
 *     summary: Create a new CIV
 *     tags: [Civs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Civ'
 *     responses:
 *       201:
 *         description: CIV created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Civ'
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/', auth, civController.createCiv);
/**
 * @swagger
 * /civs/{id}:
 *   delete:
 *     summary: Delete a CIV
 *     tags: [Civs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: CIV ID
 *     responses:
 *       200:
 *         description: CIV deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: CIV not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, civController.deleteCiv);
module.exports = router;
