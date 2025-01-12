const Photo = require('../models/Photo');
const DailyReport = require('../models/DailyReport');
const DailyActivity = require('../models/DailyActivity');

exports.uploadPhoto = async (req, res) => {
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

    await photo.save();
    console.log('Photo saved:', photo); // Debug log
    res.status(201).json(photo);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPhotosByCiv = async (req, res) => {
  try {
    const { civId, month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 31);

    // Find reports for date range
    const reports = await DailyReport.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('activities');

    // Get activities for CIV
    const activities = await DailyActivity.find({
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
          date: report?.createdAt || new Date(), // Fallback to current date if no report
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
  } catch (error) {
    console.error('Error in getPhotosByCiv:', error);
    res.status(500).json({ message: error.message });
  }
};