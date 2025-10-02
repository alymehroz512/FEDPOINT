const Category = require('../models/Category');
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

exports.createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const slug = await generateUniqueSlug(name, Category);

    const category = new Category({ name, slug, subcategories: subcategories || [] });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate('subcategories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};