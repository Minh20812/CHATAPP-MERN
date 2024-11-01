import Label from "../models/LabelModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Helper function for checking required fields
const validateLabelFields = (data) => {
  if (!data.labelname || !data.color) {
    throw new Error("Required fields are missing");
  }
};

const addLabel = asyncHandler(async (req, res) => {
  const { labelname, color } = req.body;

  validateLabelFields(req.body);

  const labelExists = await Label.findOne({ labelname });
  if (labelExists) {
    return res.status(400).json({
      message: "New label with the same name with a label already exists",
    });
  }

  const newLabel = new Label({
    labelname,
    color,
  });

  await newLabel.save();

  return res.status(201).json({
    _id: newLabel._id,
    labelname: newLabel.labelname,
    color: newLabel.color,
  });
});

const getAllLabels = asyncHandler(async (req, res) => {
  const labels = await Label.find({});
  if (!labels) {
    return res.status(404).json({ message: "No labels found" });
  }
  res.json(labels);
});

const getLabelById = asyncHandler(async (req, res) => {
  const label = await Label.findById(req.params.id);
  if (!label) {
    return res
      .status(404)
      .json({ message: `Label with ID ${req.params.id} not found` });
  }
  res.json(label);
});

const deleteLabelById = asyncHandler(async (req, res) => {
  const label = await Label.findById(req.params.id);
  if (!label) {
    return res
      .status(404)
      .json({ message: `Label with ID ${req.params.id} not found` });
  }

  await Label.deleteOne({ _id: req.params.id });
  res.json({ message: `Label with ID ${req.params.id} deleted successfully` });
});

const updateLabelById = asyncHandler(async (req, res) => {
  try {
    const label = await Label.findById(req.params.id);
    if (!label) {
      return res
        .status(404)
        .json({ message: `Label with ID ${req.params.id} not found` });
    }

    // Update only the fields that are allowed to be updated
    label.labelname = req.body.labelname || label.labelname;
    label.color = req.body.color || label.color;

    const updatedLabel = await label.save();

    res.json({
      _id: updatedLabel._id,
      labelname: updatedLabel.labelname,
      color: updatedLabel.color,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating the label",
      error: error.message,
    });
  }
});

export {
  addLabel,
  getAllLabels,
  deleteLabelById,
  getLabelById,
  updateLabelById,
};
