import ServiceSelection from '../models/serviceSelection.model.js';
import ServiceConfiguration from '../models/serviceConfiguration.model.js';
import MenuItem from '../models/menuItems.model.js';

export const getServiceSelection = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Get current service configuration
    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Service configuration not found' });
    }

    // Get selection for current version
    let selection = await ServiceSelection.findOne({
      service: serviceId,
      configurationVersion: config.version
    })
      .populate('options.selected.itemId')
      .populate('options.unselected.itemId')
      .lean();

    // If no selection exists for this version, create default
    if (!selection) {
      selection = await createDefaultSelection(serviceId, config);
    }

    res.status(200).json(selection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDefaultSelection = async (serviceId, config) => {
  const selection = new ServiceSelection({
    service: serviceId,
    configurationVersion: config.version,
    options: config.optionTypes.map(ot => ({
      optionKey: ot.key,
      selected: [],
      unselected: [],
      metadata: {
        lastModified: new Date(),
        modifiedBy: 'system'
      }
    })),
    history: [{
      timestamp: new Date(),
      changes: { action: 'created', version: config.version },
      changedBy: 'system'
    }]
  });

  await selection.save();
  return selection.toObject();
};

export const saveServiceSelection = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { options, changedBy = 'admin' } = req.body;

    if (!Array.isArray(options)) {
      return res.status(400).json({ message: 'options must be an array' });
    }

    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    // Validate option keys match configuration
    const validKeys = new Set(config.optionTypes.map(ot => ot.key));
    for (const option of options) {
      if (!validKeys.has(option.optionKey)) {
        return res.status(400).json({
          message: `Invalid option key: ${option.optionKey}`
        });
      }
    }

    // Validate referenced menu items exist
    const allItemIds = new Set();
    for (const option of options) {
      if (option.selected) option.selected.forEach(item => allItemIds.add(item.itemId));
      if (option.unselected) option.unselected.forEach(item => allItemIds.add(item.itemId));
    }

    const existingItems = await MenuItem.find({ _id: { $in: Array.from(allItemIds) } }).select('_id');
    const existingItemIds = new Set(existingItems.map(item => item._id.toString()));

    for (const itemId of allItemIds) {
      if (!existingItemIds.has(itemId.toString())) {
        return res.status(400).json({ message: `Invalid menu item ID: ${itemId}` });
      }
    }

    // Find or create selection
    let selection = await ServiceSelection.findOne({
      service: serviceId,
      configurationVersion: config.version
    });

    if (!selection) {
      selection = new ServiceSelection({
        service: serviceId,
        configurationVersion: config.version,
        options: [],
        history: []
      });
    }

    // Track changes for history
    const changes = [];

    // Update each option
    for (const newOption of options) {
      const existingIndex = selection.options.findIndex(
        o => o.optionKey === newOption.optionKey
      );

      const processedOption = {
        optionKey: newOption.optionKey,
        selected: (newOption.selected || []).map(item => ({
          itemId: item.itemId,
          customData: item.customData,
          addedAt: item.addedAt || new Date(),
          addedBy: item.addedBy || changedBy
        })),
        unselected: (newOption.unselected || []).map(item => ({
          itemId: item.itemId,
          customData: item.customData,
          addedAt: item.addedAt || new Date(),
          addedBy: item.addedBy || changedBy
        })),
        metadata: {
          lastModified: new Date(),
          modifiedBy: changedBy
        }
      };

      if (existingIndex >= 0) {
        // Track what changed
        const old = selection.options[existingIndex];
        changes.push({
          optionKey: newOption.optionKey,
          selectedBefore: old.selected.length,
          selectedAfter: processedOption.selected.length,
          unselectedBefore: old.unselected.length,
          unselectedAfter: processedOption.unselected.length
        });

        selection.options[existingIndex] = processedOption;
      } else {
        changes.push({
          optionKey: newOption.optionKey,
          action: 'created',
          selectedCount: processedOption.selected.length,
          unselectedCount: processedOption.unselected.length
        });
        selection.options.push(processedOption);
      }
    }

    // Add to history
    selection.history.push({
      timestamp: new Date(),
      changes,
      changedBy
    });

    await selection.save();

    // Populate before returning
    await selection.populate('options.selected.itemId options.unselected.itemId');

    res.status(200).json(selection.toObject());
  } catch (error) {
    console.error('Error saving service selection:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSingleOption = async (req, res) => {
  try {
    const { serviceId, optionKey } = req.params;
    const { selected, unselected, changedBy = 'admin' } = req.body;

    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    const selection = await ServiceSelection.findOne({
      service: serviceId,
      configurationVersion: config.version
    });

    if (!selection) {
      return res.status(404).json({ message: 'Selection not found' });
    }

    const optionIndex = selection.options.findIndex(o => o.optionKey === optionKey);
    if (optionIndex === -1) {
      return res.status(404).json({ message: 'Option not found in selection' });
    }

    selection.options[optionIndex] = {
      optionKey,
      selected: selected || [],
      unselected: unselected || [],
      metadata: {
        lastModified: new Date(),
        modifiedBy: changedBy
      }
    };

    selection.history.push({
      timestamp: new Date(),
      changes: { optionKey, action: 'updated' },
      changedBy
    });

    await selection.save();
    await selection.populate('options.selected.itemId options.unselected.itemId');

    res.status(200).json(selection.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSelectionHistory = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { limit = 50 } = req.query;

    const selection = await ServiceSelection.findOne({ service: serviceId })
      .select('history')
      .lean();

    if (!selection) {
      return res.status(404).json({ message: 'Selection not found' });
    }

    const history = selection.history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lockSelection = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { lockedBy = 'admin' } = req.body;

    const selection = await ServiceSelection.findOne({ service: serviceId });
    if (!selection) {
      return res.status(404).json({ message: 'Selection not found' });
    }

    if (selection.isLocked) {
      return res.status(400).json({
        message: 'Selection is already locked',
        lockedBy: selection.lockedBy,
        lockedAt: selection.lockedAt
      });
    }

    selection.isLocked = true;
    selection.lockedAt = new Date();
    selection.lockedBy = lockedBy;
    await selection.save();

    res.status(200).json(selection.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlockSelection = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const selection = await ServiceSelection.findOne({ service: serviceId });
    if (!selection) {
      return res.status(404).json({ message: 'Selection not found' });
    }

    selection.isLocked = false;
    selection.lockedAt = null;
    selection.lockedBy = null;
    await selection.save();

    res.status(200).json(selection.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const migrateToNewVersion = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const config = await ServiceConfiguration.findOne({ service: serviceId });
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    const oldSelection = await ServiceSelection.findOne({ service: serviceId })
      .sort({ configurationVersion: -1 });

    if (!oldSelection) {
      return res.status(404).json({ message: 'No previous selection found' });
    }

    // Check if selection for new version already exists
    const existingNew = await ServiceSelection.findOne({
      service: serviceId,
      configurationVersion: config.version
    });

    if (existingNew) {
      return res.status(400).json({ message: 'Selection for this version already exists' });
    }

    // Create new selection for new version
    const newSelection = new ServiceSelection({
      service: serviceId,
      configurationVersion: config.version,
      options: []
    });

    // Migrate options that still exist in new config
    const newKeys = new Set(config.optionTypes.map(ot => ot.key));
    for (const oldOption of oldSelection.options) {
      if (newKeys.has(oldOption.optionKey)) {
        newSelection.options.push({
          optionKey: oldOption.optionKey,
          selected: oldOption.selected,
          unselected: oldOption.unselected,
          metadata: {
            lastModified: new Date(),
            modifiedBy: 'system-migration'
          }
        });
      }
    }

    newSelection.history.push({
      timestamp: new Date(),
      changes: { action: 'migrated', fromVersion: oldSelection.configurationVersion, toVersion: config.version },
      changedBy: 'system'
    });

    await newSelection.save();
    await newSelection.populate('options.selected.itemId options.unselected.itemId');

    res.status(200).json(newSelection.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
