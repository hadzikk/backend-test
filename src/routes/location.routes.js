const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

router.post("/", locationController.createLocation);
router.get("/", locationController.getAllLocations);
router.get("/nearby", locationController.getNearbyLocations);
router.get("/:id", locationController.getLocationById);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);


module.exports = router;