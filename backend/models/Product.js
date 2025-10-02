const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, required: true }, // Slug of subcategory
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Soft delete flag
productSchema.add({ isDeleted: { type: Boolean, default: false } });

module.exports = mongoose.model('Product', productSchema);