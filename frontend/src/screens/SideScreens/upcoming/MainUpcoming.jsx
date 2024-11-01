import React, { useState } from "react";
import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "../../../redux/api/taskApiSlice";
import TaskDetailModal from "../today/component/TaskDetailModal";

const MainUpComing = () => {
  const { data: tasks, error, isLoading, refetch } = useGetAllTasksQuery();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [updateTask] = useUpdateTaskMutation();

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
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

  const handleCompleteTask = async (e, taskId) => {
    e.stopPropagation();
    try {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      const result = await updateTask({
        id: taskId,
        completed: true,
      }).unwrap();
      console.log("API response after update:", result);
      refetch();
    } catch (error) {
      console.log("Update failed with error:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        UpComing Tasks
      </h2>
      {tasks &&
      tasks.length > 0 &&
      tasks.filter((task) => {
        const dueDate = new Date(task.duedate).getTime();
        const reminder = task.reminders?.[0]
          ? new Date(task.reminders[0]).getTime()
          : null;
        const now = Date.now();
        return task.completed === false && dueDate > now && reminder > now;
      }).length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tasks
              .filter((task) => {
                const dueDate = new Date(task.duedate).getTime();
                const reminder = task.reminders?.[0]
                  ? new Date(task.reminders[0]).getTime()
                  : null;
                const now = Date.now();
                return (
                  task.completed === false && dueDate > now && reminder > now
                );
              })
              .map((task) => (
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
                  <button
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                    onClick={(e) => handleCompleteTask(e, task._id)}
                  >
                    Completed
                  </button>
                </div>
              ))}
          </div>
        </>
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

export default MainUpComing;
