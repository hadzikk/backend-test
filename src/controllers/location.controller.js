const Location = require("../models/location.controller");

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { name, category, longitude, latitude } = req.body;

    // Validasi input
    if (!name || longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, longitude, and latitude are required.",
      });
    }

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lon) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude must be numbers.",
      });
    }

    const location = await Location.create({
      name,
      category,
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
    });

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }
    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a location by ID
exports.updateLocation = async (req, res) => {
  try {
    const { name, category, longitude, latitude } = req.body;

    const updatedData = { name, category };

    if (longitude !== undefined && latitude !== undefined) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);

      if (isNaN(lon) || isNaN(lat)) {
        return res.status(400).json({
          success: false,
          message: "Longitude and latitude must be numbers.",
        });
      }

      updatedData.location = {
        type: "Point",
        coordinates: [lon, lat],
      };
    }

    const location = await Location.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete location by ID
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }
    res.status(200).json({ success: true, message: "Location deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Find nearby locations
exports.getNearbyLocations = async (req, res) => {
  try {
    let { longitude, latitude, distance } = req.query;

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const dist = parseFloat(distance);

    if (isNaN(lon) || isNaN(lat) || isNaN(dist)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing longitude, latitude, or distance parameters.",
      });
    }

    // Konversi jarak dari kilometer ke radian
    const radius = dist / 6378.1;

    const locations = await Location.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lon, lat], radius],
        },
      },
    });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
