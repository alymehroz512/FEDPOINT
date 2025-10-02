const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');

exports.getStats = async (req, res) => {
  try {
    const total = await Product.countDocuments({ isDeleted: false });

    // Current month activities
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const added = await ActivityLog.countDocuments({
      action: 'add',
      timestamp: { $gte: startOfMonth }
    });
    const updated = await ActivityLog.countDocuments({
      action: 'update',
      timestamp: { $gte: startOfMonth }
    });
    const deleted = await ActivityLog.countDocuments({
      action: 'delete',
      timestamp: { $gte: startOfMonth }
    });

    // Overall
    const overallAdded = await ActivityLog.countDocuments({ action: 'add' });
    const overallUpdated = await ActivityLog.countDocuments({ action: 'update' });
    const overallDeleted = await ActivityLog.countDocuments({ action: 'delete' });

    res.json({
      total,
      currentMonth: { added, updated, deleted },
      overall: { added: overallAdded, updated: overallUpdated, deleted: overallDeleted }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const { year, type = 'monthly' } = req.query; // monthly or yearly
    const match = { timestamp: { $gte: new Date(`${year}-01-01`) } };

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: type === 'monthly' ? { $dateToString: { format: '%Y-%m', date: '$timestamp' } } : { $dateToString: { format: '%Y', date: '$timestamp' } },
          added: { $sum: { $cond: [{ $eq: ['$action', 'add'] }, 1, 0] } },
          updated: { $sum: { $cond: [{ $eq: ['$action', 'update'] }, 1, 0] } },
          deleted: { $sum: { $cond: [{ $eq: ['$action', 'delete'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const trends = await ActivityLog.aggregate(pipeline);
    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};