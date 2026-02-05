import ServiceConfiguration from '../models/serviceConfiguration.model.js';
import Service from '../models/service.model.js';
import ServiceSelection from '../models/serviceSelection.model.js';

export const getServiceConfiguration = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const config = await ServiceConfiguration.findOne({ service: serviceId }).lean();

    if (!config) {
      return res.status(404).json({ message: 'Service configuration not found' });
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrUpdateConfiguration = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { optionTypes, selectionRules } = req.body;

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Validate option types
    if (!optionTypes || !Array.isArray(optionTypes) || optionTypes.length === 0) {
      return res.status(400).json({ message: 'At least one option type is required' });
    }

    // Check for duplicate keys
    const keys = optionTypes.map(ot => ot.key);
    const uniqueKeys = new Set(keys);
    if (keys.length !== uniqueKeys.size) {
      return res.status(400).json({ message: 'Duplicate option type keys found' });
    }

    let config = await ServiceConfiguration.findOne({ service: serviceId });

    if (config) {
      // Update existing - increment version if option types changed
      const optionTypesChanged = JSON.stringify(config.optionTypes) !== JSON.stringify(optionTypes);

      if (optionTypesChanged) {
        config.version += 1;
      }

      config.optionTypes = optionTypes;
      config.selectionRules = selectionRules || config.selectionRules;
      await config.save();
    } else {
      // Create new
      config = new ServiceConfiguration({
        service: serviceId,
        optionTypes,
        selectionRules: selectionRules || {},
        version: 1
      });
      await config.save();
    }

    res.status(200).json(config.toObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addOptionType = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const optionType = req.body;

    if (!optionType.key || !optionType.label) {
      return res.status(400).json({ message: 'Option type key and label are required' });
    }

    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Service configuration not found' });
    }

    // Check for duplicate key
    if (config.optionTypes.find(ot => ot.key === optionType.key)) {
      return res.status(400).json({ message: 'Option type with this key already exists' });
    }

    config.optionTypes.push(optionType);
    config.version += 1;
    await config.save();

    res.status(200).json(config.toObject());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeOptionType = async (req, res) => {
  try {
    const { serviceId, key } = req.params;

    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Service configuration not found' });
    }

    const initialLength = config.optionTypes.length;
    config.optionTypes = config.optionTypes.filter(ot => ot.key !== key);

    if (config.optionTypes.length === initialLength) {
      return res.status(404).json({ message: 'Option type not found' });
    }

    config.version += 1;
    await config.save();

    res.status(200).json(config.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderOptionTypes = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { orderedKeys } = req.body;

    if (!Array.isArray(orderedKeys)) {
      return res.status(400).json({ message: 'orderedKeys must be an array' });
    }

    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Service configuration not found' });
    }

    // Validate all keys exist
    const existingKeys = new Set(config.optionTypes.map(ot => ot.key));
    for (const key of orderedKeys) {
      if (!existingKeys.has(key)) {
        return res.status(400).json({ message: `Invalid option type key: ${key}` });
      }
    }

    // Reorder
    const optionTypesMap = new Map(config.optionTypes.map(ot => [ot.key, ot]));
    config.optionTypes = orderedKeys.map((key, index) => {
      const ot = optionTypesMap.get(key);
      ot.displayOrder = index;
      return ot;
    });

    await config.save();
    res.status(200).json(config.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
