const Brand = require('../models/Brand');
const slugify = require('slugify');

const generateUniqueSlug = async (name, model) => {
  let slug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = slug;
  let counter = 1;
  while (await model.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

exports.createBrand = async (req, res) => {
  try {
    const { name, category } = req.body;
    const slug = await generateUniqueSlug(name, Brand);

    const brand = new Brand({ name, slug, category });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).populate('category', 'name');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};