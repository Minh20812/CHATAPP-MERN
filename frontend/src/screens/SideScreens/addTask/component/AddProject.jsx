import React, { useState } from "react";
import { useAddProjectMutation } from "../../../../redux/api/projectApiSlice";

const AddProject = ({ isOpen, closeModal, onProjectAdded }) => {
  const [addProject] = useAddProjectMutation();
  const [formData, setFormData] = useState({
    projectname: "",
    info: "",
    color: "#000000",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      projectname: "",
      info: "",
      color: "#000000",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.projectname.trim()) {
        setError("Project name is required");
        return;
      }

      const result = await addProject({
        projectname: formData.projectname.trim(),
        info: formData.info.trim(),
        color: formData.color,
      }).unwrap();

      if (result.id) {
        onProjectAdded(result.id);
        resetForm();
      }

      closeModal();
    } catch (err) {
      setError(err.message || "Failed to add project");
      console.error("Failed to add project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Add New Project</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="projectname"
              className="block text-sm font-medium text-gray-700"
            >
              Project Name
            </label>
            <input
              type="text"
              value={formData.projectname}
              onChange={handleChange}
              name="projectname"
              id="projectname"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter project name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="info"
              className="block text-sm font-medium text-gray-700"
            >
              Project Info
            </label>
            <textarea
              value={formData.info}
              onChange={handleChange}
              name="info"
              id="info"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter project description"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Project Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={handleChange}
              name="color"
              id="color"
              required
              className="mt-1 block w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
