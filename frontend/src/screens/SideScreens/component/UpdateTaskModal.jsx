import { useEffect, useState } from "react";
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../../redux/api/taskApiSlice";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const UpdateTaskModal = ({ isOpen, closeModal, task, refetch }) => {
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        if (refetch) refetch();
        closeModal();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const [formData, setFormData] = useState({
    taskname: "",
    description: "",
    subtaskname: "",
    project: "",
    duedate: "",
    priority: "",
    labels: "",
    reminders: "",
    location: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        taskname: task.taskname || "",
        description: task.description || "",
        subtaskname: task.subtaskname || "",
        project: task.project || "",
        duedate: task.duedate || "",
        priority: task.priority || "",
        labels: task.labels || "",
        reminders: task.reminders || "",
        location: task.location || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      if (!task || !task._id) {
        throw new Error("Task ID is missing");
      }

      console.log("Data sent to update API:", formData);

      const result = await updateTask({ id: task._id, ...formData }).unwrap();

      toast.success("Task updated successfully!");
      console.log("API response after update:", result);
      refetch();
      closeModal();
    } catch (error) {
      console.log("Update failed with error:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleModalClose = () => {
    setFormData({
      taskname: "",
      description: "",
      subtaskname: "",
      project: "",
      duedate: "",
      priority: "",
      labels: "",
      reminders: "",
      location: "",
    });
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleModalClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Task
                </Dialog.Title>
                <form onSubmit={handleUpdateTask} className="mt-2">
                  {/* Input fields */}
                  <div className="mb-4">
                    <label
                      htmlFor="taskname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Taskname
                    </label>
                    <input
                      type="text"
                      onChange={handleChange}
                      name="taskname"
                      id="taskname"
                      value={formData.taskname}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="subtaskname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subtaskname
                    </label>
                    <input
                      type="text"
                      name="subtaskname"
                      id="subtaskname"
                      value={formData.subtaskname}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="project"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Project
                    </label>
                    <input
                      type="number"
                      name="project"
                      id="project"
                      value={formData.project}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="duedate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duedate
                    </label>
                    <input
                      type="date"
                      name="duedate"
                      id="duedate"
                      value={formData.duedate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700"
                    >
                      priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="labels"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Labels
                    </label>
                    <input
                      type="text"
                      name="labels"
                      id="labels"
                      value={formData.labels}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="reminders"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start date
                    </label>
                    <input
                      type="text"
                      name="reminders"
                      id="reminders"
                      value={formData.reminders}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-pink-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-pink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
                      onClick={() => deleteHandler(task._id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateTaskModal;
