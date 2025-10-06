const Location = require("../models/location.controller");

exports.createLocation = async (req, res) => {
  try {
    const { name, category, longitude, latitude } = req.body;

    if (!name || !longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Name, longitude, and latitude are required.",
      });
    }

    const location = await Location.create({
      name,
      category,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a single location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update location by ID
exports.updateLocation = async (req, res) => {
  try {
    const { name, category, longitude, latitude } = req.body;

    const updatedData = { name, category };
    if (longitude && latitude) {
      updatedData.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    const location = await Location.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete location by ID
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }
    res.json({ success: true, message: "Location deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Find nearby locations
exports.getNearbyLocations = async (req, res) => {
  try {
    let { longitude, latitude, distance } = req.query;

    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
    distance = parseFloat(distance);

    if (isNaN(longitude) || isNaN(latitude) || isNaN(distance)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing longitude, latitude, or distance parameters.",
      });
    }

    const radius = distance / 6378.1; // convert km → radians

    const locations = await Location.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius],
        },
      },
    });

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};