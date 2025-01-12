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
const Photo = require('../models/Photo');
const DailyReport = require('../models/DailyReport');
const DailyActivity = require('../models/DailyActivity');
exports.uploadPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { civ, reportId, fotografia } = req.body;
        if (!fotografia) {
            return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen' });
        }
        const photo = new Photo({
            civ,
            reportId,
            fotografia,
            date: new Date()
        });
        yield photo.save();
        console.log('Photo saved:', photo); // Debug log
        res.status(201).json(photo);
    }
    catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.getPhotosByCiv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { civId, month, year } = req.query;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 31);
        // Find reports for date range
        const reports = yield DailyReport.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('activities');
        // Get activities for CIV
        const activities = yield DailyActivity.find({
            civ: civId,
            _id: {
                $in: reports.flatMap(report => report.activities)
            }
        }).populate('civ');
        // Extract photos with debug logs
        const photos = activities
            .filter(activity => activity.fotografia)
            .map(activity => {
            const report = reports.find(r => r.activities.includes(activity._id));
            return {
                _id: activity._id,
                date: (report === null || report === void 0 ? void 0 : report.createdAt) || new Date(), // Fallback to current date if no report
                fotografia: activity.fotografia,
                civ: activity.civ
            };
        });
        // Group by date with debug
        const groupedPhotos = photos.reduce((acc, photo) => {
            const date = photo.date.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(photo);
            return acc;
        }, {});
        res.json(groupedPhotos);
    }
    catch (error) {
        console.error('Error in getPhotosByCiv:', error);
        res.status(500).json({ message: error.message });
    }
});
