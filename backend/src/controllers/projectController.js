import Project from "../models/ProjectModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Helper function for checking required fields
const validateProjectFields = (data) => {
  if (!data.projectname || !data.info || !data.color) {
    throw new Error("Required fields are missing");
  }
};

const addProject = asyncHandler(async (req, res) => {
  const { projectname, info, color } = req.body;

  validateProjectFields(req.body);

  const projectExists = await Project.findOne({ projectname, info });
  if (projectExists) {
    return res.status(400).json({
      message: "Project with the same name with a project already exists",
    });
  }

  const newProject = new Project({
    projectname,
    info,
    color,
  });

  await newProject.save();

  return res.status(201).json({
    _id: newProject._id,
    projectname: newProject.projectname,
    info: newProject.info,
    color: newProject.color,
  });
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  if (!projects) {
    return res.status(404).json({ message: "No Projects found" });
  }
  res.json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res
      .status(404)
      .json({ message: `Project with ID ${req.params.id} not found` });
  }
  res.json(project);
});

const deleteProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res
      .status(404)
      .json({ message: `Project with ID ${req.params.id} not found` });
  }

  await Project.deleteOne({ _id: req.params.id });
  res.json({
    message: `Project with ID ${req.params.id} deleted successfully`,
  });
});

const updateProjectById = asyncHandler(async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with ID ${req.params.id} not found` });
    }

    // Update only the fields that are allowed to be updated
    project.projectname = req.body.projectname || project.projectname;
    project.info = req.body.info || project.info;
    project.color = req.body.color || project.color;

    const updatedProject = await Project.save();

    res.json({
      _id: updatedProject._id,
      projectname: updatedProject.projectname,
      info: updatedProject.info,
      color: updatedProject.color,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating the Project",
      error: error.message,
    });
  }
});

export {
  addProject,
  getAllProjects,
  deleteProjectById,
  getProjectById,
  updateProjectById,
};
