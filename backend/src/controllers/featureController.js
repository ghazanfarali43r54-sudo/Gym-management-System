const Feature = require("../models/features");

exports.getFeatures = async (_req, res) => {
  try {
    const features = await Feature.find({}).sort({ name: 1 });
    res.json({ success: true, data: features });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFeature = async (req, res) => {
  try {
    const feature = await Feature.create(req.body);
    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!feature) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    res.json({ success: true, data: feature });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    res.json({ success: true, message: "Feature deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
