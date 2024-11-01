import mongoose from "mongoose";

const subtaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const taskSchema = mongoose.Schema(
  {
    taskname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subtasks: {
      type: [subtaskSchema],
      default: [],
    },
    project: {
      type: String,
      required: true,
    },
    duedate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    labels: {
      type: [String],
      default: [],
    },
    reminders: {
      type: [Date],
      default: [],
    },
    location: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
