import Food from '../models/popularFoodItems.models.js';

// Get all food items
export const getAllFoodItems = async (req, res) => {
  try {
    const items = await Food.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new food item
export const addFoodItem = async (req, res) => {
  const { name, price, image, description, isVeg } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ message: 'Name, price, and image are required' });
  }

  try {
    const newItem = new Food({ name, price, image, description, isVeg });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete food item
export const deleteFoodItem = async (req, res) => {
  try {
    const deletedItem = await Food.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
    console.log("POPULAR ITEM DELETED:", deletedItem)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};