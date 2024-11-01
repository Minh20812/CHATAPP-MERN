import mongoose from "mongoose";

const labelSchema = mongoose.Schema(
  {
    labelname: {
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

const Label = mongoose.model("Label", labelSchema);
export default Label;
