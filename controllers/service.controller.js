import Service from '../models/service.model.js';
import Category from '../models/category.model.js';

export const getAllServices = async (req, res) => {
  try {
    const {
      active,
      featured,
      categoryId,
      includeDeleted,
      sort = '-createdAt',
      page = 1,
      limit = 50
    } = req.query;

    const query = {};
    if (active !== undefined) query.active = active === 'true';
    if (featured !== undefined) query.featured = featured === 'true';
    if (categoryId) query.category = categoryId;
    if (!includeDeleted || includeDeleted === 'false') query.isDeleted = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('category', 'name slug icon')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Service.countDocuments(query)
    ]);

    res.status(200).json({
      services,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id)
      .populate('category', 'name slug icon')
      .lean();

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Increment view count
    await Service.findByIdAndUpdate(id, { $inc: { 'metadata.views': 1 } });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const services = await Service.find({
      category: categoryId,
      active: true,
      isDeleted: false
    })
      .sort('-featured -metadata.rating')
      .lean();

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchServices = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    const query = { active: true, isDeleted: false };

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = parseFloat(maxPrice);
    }

    const services = await Service.find(query)
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' }, '-metadata.rating': 1 })
      .lean();

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      shortDescription,
      images,
      pricing,
      availability,
      active,
      featured,
      tags
    } = req.body;

    if (!name || !category || !description || !pricing?.basePrice) {
      return res.status(400).json({
        message: 'Name, category, description, and base price are required'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const service = new Service({
      name,
      category,
      description,
      shortDescription,
      images: images || [],
      pricing,
      availability,
      active: active !== undefined ? active : true,
      featured: featured || false,
      tags: tags || []
    });

    await service.save();

    // Update category metadata
    await Category.findByIdAndUpdate(category, {
      $inc: { 'metadata.serviceCount': 1 },
      $set: { 'metadata.lastServiceAddedAt': new Date() }
    });

    await service.populate('category', 'name slug icon');
    res.status(201).json(service.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If category is being changed, verify it exists
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('category', 'name slug icon');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, active: false } },
      { new: true, lean: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update category metadata
    await Category.findByIdAndUpdate(service.category, {
      $inc: { 'metadata.serviceCount': -1 }
    });

    res.status(200).json({ message: 'Service deleted successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.active = !service.active;
    await service.save();

    res.status(200).json(service.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleServiceFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.featured = !service.featured;
    await service.save();

    res.status(200).json(service.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
