import React, { useState, useEffect } from "react";
import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "../../../redux/api/taskApiSlice";
import TaskDetailModal from "../today/component/TaskDetailModal";

const priorities = [
  { name: "Low", value: "low" },
  { name: "Medium", value: "medium" },
  { name: "High", value: "high" },
];

const MainFilterAndLabels = () => {
  const { data: tasks, refetch } = useGetAllTasksQuery();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [updateTask] = useUpdateTaskMutation();
  const [expiredTasks, setExpiredTasks] = useState([]);

  // State cho các giá trị lọc
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm taskname
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  // Lọc task dựa trên Taskname, Label, Project, và Priority
  const filteredTasks = tasks
    ? tasks.filter((task) => {
        const matchSearchTerm = searchTerm
          ? task.taskname.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const matchLabel = selectedLabel
          ? task.labels.includes(selectedLabel)
          : true;
        const matchProject = selectedProject
          ? task.project === selectedProject
          : true;
        const matchPriority = selectedPriority
          ? task.priority === selectedPriority
          : true;
        return matchSearchTerm && matchLabel && matchProject && matchPriority;
      })
    : [];

  const handleCompleteTask = async (e, taskId) => {
    e.stopPropagation();
    try {
      const result = await updateTask({
        id: taskId,
        completed: true,
      }).unwrap();
      console.log("Task marked as completed:", result);
      refetch();
    } catch (error) {
      console.log("Error marking task as completed:", error);
    }
  };

  const handleUnCompleteTask = async (e, taskId) => {
    e.stopPropagation();
    try {
      const result = await updateTask({
        id: taskId,
        completed: false,
      }).unwrap();
      console.log("Task marked as incomplete:", result);
      refetch();
    } catch (error) {
      console.log("Error marking task as incomplete:", error);
    }
  };

  useEffect(() => {
    if (tasks) {
      const now = Date.now();
      const expired = tasks.filter((task) => {
        const dueDate = Date.parse(task.duedate);
        return dueDate && dueDate < now;
      });
      setExpiredTasks(expired);
    }
  }, [tasks]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Filter and Search Tasks
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-gray-600 font-semibold mb-2">
          Search by Taskname:
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-2 w-full"
          placeholder="Enter task name"
        />
      </div>

      {/* Dropdown Filter Section */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        {/* Filter by Label */}
        <div className="mb-4 sm:mb-0">
          <label className="block text-gray-600 font-semibold mb-2">
            Filter by Label:
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
          >
            <option value="">All Labels</option>
            {tasks &&
              Array.from(new Set(tasks.flatMap((task) => task.labels))).map(
                (label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                )
              )}
          </select>
        </div>

        {/* Filter by Project */}
        <div className="mb-4 sm:mb-0">
          <label className="block text-gray-600 font-semibold mb-2">
            Filter by Project:
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">All Projects</option>
            {tasks &&
              Array.from(new Set(tasks.map((task) => task.project))).map(
                (project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                )
              )}
          </select>
        </div>

        {/* Filter by Priority */}
        <div>
          <label className="block text-gray-600 font-semibold mb-2">
            Filter by Priority:
          </label>
          <select
            className="border rounded-lg p-2 w-full"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtered Tasks */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:cursor-pointer"
              onClick={() => openTaskModal(task)}
            >
              <h3 className="text-xl font-semibold text-indigo-600">
                {task.taskname}
              </h3>
              <p className="text-gray-600">
                <strong>Due Date:</strong>{" "}
                {task.duedate
                  ? new Date(task.duedate).toLocaleDateString()
                  : "No due date"}
              </p>

              {/* Render nút theo trạng thái completed */}
              {task.completed ? (
                <button
                  className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                  onClick={(e) => handleUnCompleteTask(e, task._id)}
                >
                  Uncompleted
                </button>
              ) : (
                <button
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                  onClick={(e) => handleCompleteTask(e, task._id)}
                >
                  Completed
                </button>
              )}

              {task.duedate && Date.parse(task.duedate) < Date.now() ? (
                <button className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                  Expired
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No tasks available.</p>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={isModalOpen}
          closeModal={closeTaskModal}
          task={selectedTask}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default MainFilterAndLabels;
