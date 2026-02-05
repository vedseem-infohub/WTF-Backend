import Event from "../models/events.model.js";

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().lean().sort({ date: 1 }); // Sorted by date (assuming string date for now, ideally should be Date object or ISO string)
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events", error: error.message, stack: error.stack });
  }
};

const addEvent = async (req, res) => {
  try {
    const { title, date, location, description, type, status, image } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const newEvent = await Event.create({
      title,
      date,
      location,
      description,
      type,
      status,
      image,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Failed to add event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, location, description, type, status, image } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, date, location, description, type, status, image },
      { new: true, lean: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

export { getEvents, addEvent, updateEvent, deleteEvent };
