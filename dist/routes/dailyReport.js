"use strict";
const express = require('express');
const router = express.Router();
const dailyReportController = require('../controllers/dailyReportController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
/**
 * @swagger
 * components:
 *   schemas:
 *     DailyReport:
 *       type: object
 *       required:
 *         - date
 *         - summary
 *         - activities
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated report ID
 *         date:
 *           type: string
 *           format: date
 *           description: Report date
 *         summary:
 *           type: string
 *           description: Report summary
 *         activities:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of activity IDs
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Report status
 *         createdBy:
 *           type: string
 *           description: User ID who created the report
 *         approvedBy:
 *           type: string
 *           description: User ID who approved/rejected the report
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           description: Approval/rejection date
 *         rejectionReason:
 *           type: string
 *           description: Reason for rejection
 *       example:
 *         date: "2024-01-03"
 *         summary: "Informe diario de actividades"
 *         activities: ["507f1f77bcf86cd799439011"]
 *         status: "pending"
 */
/**
 * @swagger
 * tags:
 *   name: DailyReports
 *   description: Daily report management API
 */
/**
 * @swagger
 * /daily-reports:
 *   get:
 *     summary: List all daily reports
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of daily reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyReport'
 */
router.get('/', auth, authorize(['view_reports']), dailyReportController.getReports);
/**
 * @swagger
 * /daily-reports/{id}:
 *   get:
 *     summary: Get a daily report by ID
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily report found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyReport'
 */
router.get('/:id', auth, authorize(['view_reports']), dailyReportController.getReportById);
/**
 * @swagger
 * /daily-reports:
 *   post:
 *     summary: Create a new daily report
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DailyReport'
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyReport'
 */
router.post('/', auth, authorize(['create_reports']), dailyReportController.createReport);
/**
 * @swagger
 * /daily-reports/{id}:
 *   put:
 *     summary: Update a daily report
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DailyReport'
 *     responses:
 *       200:
 *         description: Report updated successfully
 */
router.put('/:id', auth, authorize(['edit_reports']), dailyReportController.updateReport);
/**
 * @swagger
 * /daily-reports/{id}:
 *   delete:
 *     summary: Delete a daily report
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 */
router.delete('/:id', auth, authorize(['delete_reports']), dailyReportController.deleteReport);
/**
 * @swagger
 * /daily-reports/{id}/approve:
 *   put:
 *     summary: Approve a daily report
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyReport'
 */
router.put('/:id/approve', auth, authorize(['approve_reports']), dailyReportController.approveReport);
/**
 * @swagger
 * /daily-reports/{id}/reject:
 *   put:
 *     summary: Reject a daily report
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyReport'
 */
router.put('/:id/reject', auth, authorize(['reject_reports']), dailyReportController.rejectReport);
/**
 * @swagger
 * /daily-reports/{id}/pdf:
 *   get:
 *     summary: Generate PDF for a daily report
 *     tags: [DailyReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', auth, authorize(['view_reports']), dailyReportController.generateReportPDF);
module.exports = router;
