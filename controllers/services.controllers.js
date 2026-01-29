import Service from '../models/services.model.js';

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new service
export const addService = async (req, res) => {
  const { title, image, active } = req.body;

  if (!title || !image) {
    return res.status(400).json({ message: 'Title and image are required' });
  }

  try {
    const newService = new Service({ title, image, active });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, image, active } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { title, image, active },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
