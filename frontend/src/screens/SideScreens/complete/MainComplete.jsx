import React, { useState, useEffect } from "react";
import { useGetAllTasksQuery } from "../../../redux/api/taskApiSlice";
import TaskDetailModal from "../today/component/TaskDetailModal";
import { useUpdateTaskMutation } from "../../../redux/api/taskApiSlice";

const MainCompleted = () => {
  const { data: tasks, error, isLoading } = useGetAllTasksQuery();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [expiredTasks, setExpiredTasks] = useState([]);
  const [updateTask] = useUpdateTaskMutation();

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

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleUnCompleteTask = async (e, taskId) => {
    e.stopPropagation();
    try {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      const result = await updateTask({
        id: taskId,
        completed: false,
      }).unwrap();
      console.log("API response after update:", result);
    } catch (error) {
      console.log("Update failed with error:", error);
    }
  };

  if (isLoading) {
    return <p className="text-center py-4">Loading tasks...</p>;
  }

  if (error) {
    return (
      <p className="text-center py-4 text-red-500">
        Error loading tasks: {error.message}
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Completed & Expired Tasks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tasks &&
        tasks.length > 0 &&
        tasks.filter((task) => task.completed === true).length > 0 ? (
          <div>
            {tasks
              .filter((task) => task.completed === true)
              .map((task) => (
                <div
                  key={task._id}
                  className={`p-4 sm:p-6 rounded-lg shadow-lg hover:cursor-pointer mt-3 ${
                    task.completed ? "bg-green-500" : "bg-red-500"
                  }`}
                  onClick={() => openTaskModal(task)}
                >
                  <h3 className="text-xl font-semibold text-white">
                    {task.taskname}
                  </h3>
                  <p className="text-white">
                    <strong>Due Date:</strong>
                    {task.duedate
                      ? new Date(task.duedate).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <button
                    className="mt-4 w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50"
                    onClick={(e) => handleUnCompleteTask(e, task._id)}
                  >
                    Uncompleted
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No tasks completed.</p>
        )}

        {expiredTasks.length === 0 ? (
          <p>No expired tasks found</p>
        ) : (
          <div>
            {expiredTasks.map((task) => (
              <div
                key={task._id}
                className={`p-4 sm:p-6 ${
                  task.completed ? "bg-green-500" : "bg-red-500"
                } rounded-lg shadow-lg hover:cursor-pointer mt-3`}
                onClick={() => openTaskModal(task)}
              >
                <h3 className="text-xl font-semibold text-white">
                  {task.taskname}
                </h3>
                <p className="text-white">
                  <strong>Due Date:</strong>
                  {task.duedate
                    ? new Date(task.duedate).toLocaleDateString()
                    : "No due date"}
                </p>
                <button className="mt-4 w-full bg-gray-600  text-white py-2 px-4 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                  Expired
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedTask && (
        <TaskDetailModal
          isOpen={isModalOpen}
          closeModal={closeTaskModal}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default MainCompleted;
