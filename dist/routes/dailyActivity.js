"use strict";
const express = require('express');
const router = express.Router();
const dailyActivityController = require('../controllers/dailyActivityController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
/**
 * @swagger
 * components:
 *   schemas:
 *     DailyActivity:
 *       type: object
 *       required:
 *         - civ
 *         - ubi_inicial
 *         - ubi_final
 *         - item
 *         - actividad
 *         - largo
 *         - ancho
 *         - alto
 *         - descuento_largo
 *         - descuento_ancho
 *         - descuento_alto
 *         - fotografia
 *         - observaciones
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the activity
 *         civ:
 *           type: string
 *           description: CIV ID
 *         ubi_inicial:
 *           type: string
 *           description: Ubicación inicial
 *         ubi_final:
 *           type: string
 *           description: Ubicación final
 *         item:
 *           type: string
 *           description: Item
 *         actividad:
 *           type: string
 *           description: Actividad
 *         largo:
 *           type: number
 *           description: Largo
 *         ancho:
 *           type: number
 *           description: Ancho
 *         alto:
 *           type: number
 *           description: Alto
 *         descuento_largo:
 *           type: number
 *           description: Descuento largo
 *         descuento_ancho:
 *           type: number
 *           description: Descuento ancho
 *         descuento_alto:
 *           type: number
 *           description: Descuento alto
 *         fotografia:
 *           type: string
 *           description: Fotografía
 *         observaciones:
 *           type: string
 *           description: Observaciones
 *       example:
 *         id: d5fE_asz
 *         civ: 60c72b2f9b1d8b3a2c8e4d5e
 *         ubi_inicial: "Ubicación inicial"
 *         ubi_final: "Ubicación final"
 *         item: "Item"
 *         actividad: "Actividad"
 *         largo: 10
 *         ancho: 5
 *         alto: 3
 *         descuento_largo: 1
 *         descuento_ancho: 1
 *         descuento_alto: 1
 *         fotografia: "fotografia.jpg"
 *         observaciones: "Observaciones"
 */
/**
 * @swagger
 * tags:
 *   name: DailyActivities
 *   description: Daily Activity management
 */
/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get all activities
 *     tags: [DailyActivities]
 *     responses:
 *       200:
 *         description: List of all activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyActivity'
 *       500:
 *         description: Server error
 */
router.get('/', auth, authorize(['view_activities']), dailyActivityController.getActivities);
/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Get activity by ID
 *     tags: [DailyActivities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyActivity'
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, authorize(['view_activities']), dailyActivityController.getActivityById);
/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [DailyActivities]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DailyActivity'
 *     responses:
 *       201:
 *         description: Activity created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyActivity'
 *       500:
 *         description: Server error
 */
router.post('/', auth, authorize(['create_activities']), dailyActivityController.createActivity);
/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Update an activity
 *     tags: [DailyActivities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Activity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DailyActivity'
 *     responses:
 *       200:
 *         description: Activity updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyActivity'
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, authorize(['update_activities']), dailyActivityController.updateActivity);
/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [DailyActivities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity deleted
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, authorize(['delete_activities']), dailyActivityController.deleteActivity);
module.exports = router;
