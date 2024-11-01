import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    projectname: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
