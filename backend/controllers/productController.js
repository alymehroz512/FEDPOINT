const Product = require('../models/Product');
const Category = require('../models/Category');
const ActivityLog = require('../models/ActivityLog');
const slugify = require('slugify');
const upload = require('../middleware/upload');

const generateUniqueSlug = async (name, existingId = null) => {
  let slug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = slug;
  let counter = 1;
  while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: existingId } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

exports.addProduct = [
  upload.single('image'),  // Keep Multer for real uploads
  async (req, res) => {
    try {
      const { name, description, category, subcategory, brand } = req.body;
      const slug = await generateUniqueSlug(name);

      // UPDATED: Accept string from body OR file upload
      let imageUrl = '';
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.image) {
        imageUrl = req.body.image;  // Use dummy path from JSON
      }

      const product = new Product({
        name,
        slug,
        description,
        imageUrl,  // Now can be empty or dummy
        category,
        subcategory,
        brand,
        createdBy: req.user.id
      });
      await product.save();

      // Log activity (unchanged)
      await new ActivityLog({
        productId: product._id,
        action: 'add',
        userId: req.user.id
      }).save();

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.brand) filter.brand = req.query.brand;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('brand', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      let product = await Product.findById(id);
      if (!product || product.isDeleted) return res.status(404).json({ error: 'Product not found' });

      // Update fields
      if (updates.name && updates.name !== product.name) {
        updates.slug = await generateUniqueSlug(updates.name, product._id);
      }
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

      product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

      // Log activity
      await new ActivityLog({
        productId: id,
        action: 'update',
        userId: req.user.id
      }).save();

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product || product.isDeleted) return res.status(404).json({ error: 'Product not found' });

    await Product.findByIdAndUpdate(id, { isDeleted: true });

    // Log activity
    await new ActivityLog({
      productId: id,
      action: 'delete',
      userId: req.user.id
    }).save();

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};