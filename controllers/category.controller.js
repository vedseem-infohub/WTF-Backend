import Category from '../models/category.model.js';
import Service from '../models/service.model.js';

export const getAllCategories = async (req, res) => {
  try {
    const { active, includeDeleted, sort = 'displayOrder' } = req.query;

    const query = {};
    if (active !== undefined) query.active = active === 'true';
    if (!includeDeleted || includeDeleted === 'false') query.isDeleted = false;

    const categories = await Category.find(query)
      .sort(sort)
      .lean();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).lean();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, icon, displayOrder, active } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    // Get current max display order if not provided
    let order = displayOrder;
    if (order === undefined) {
      const maxOrder = await Category.findOne().sort('-displayOrder').select('displayOrder').lean();
      order = maxOrder ? maxOrder.displayOrder + 1 : 0;
    }

    const category = new Category({
      name,
      description,
      image,
      icon,
      displayOrder: order,
      active: active !== undefined ? active : true
    });

    await category.save();
    res.status(201).json(category.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, lean: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has active services
    const activeServices = await Service.countDocuments({
      category: id,
      active: true,
      isDeleted: false
    });

    if (activeServices > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with active services',
        activeServices
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, active: false } },
      { new: true, lean: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleCategoryActive = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.active = !category.active;
    await category.save();

    res.status(200).json(category.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOrder } = req.body;

    if (newOrder === undefined || newOrder < 0) {
      return res.status(400).json({ message: 'Valid newOrder is required' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { displayOrder: newOrder } },
      { new: true, lean: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
