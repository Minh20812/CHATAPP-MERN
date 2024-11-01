import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "../../../redux/api/taskApiSlice";
import TaskDetailModal from "../today/component/TaskDetailModal";

const CalendarView = () => {
  const { data: tasks, refetch } = useGetAllTasksQuery();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  // Khi người dùng chọn một ngày
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Lọc task theo ngày đã chọn
  useEffect(() => {
    if (tasks) {
      const tasksOnDate = tasks.filter((task) => {
        const taskDate = new Date(task.duedate).setHours(0, 0, 0, 0);
        const selected = selectedDate.setHours(0, 0, 0, 0);
        return taskDate === selected;
      });
      setTasksForSelectedDate(tasksOnDate);
    }
  }, [selectedDate, tasks]);

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  // Hiển thị task cho ngày được chọn
  const renderTasksForSelectedDate = () => {
    if (tasksForSelectedDate.length > 0) {
      return (
        <div className="task-list mt-4">
          {tasksForSelectedDate.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-lg shadow-lg mb-2"
              onClick={() => openTaskModal(task)}
            >
              <h3 className="text-xl font-semibold text-indigo-600">
                {task.taskname}
              </h3>
              <p className="text-gray-600">
                <strong>Due Date:</strong>{" "}
                {new Date(task.duedate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <p className="text-gray-600 text-center">No tasks for this date.</p>
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Calendar View
      </h2>

      {/* Calendar Component */}
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        className="bg-white p-4 rounded-lg shadow-lg"
        tileContent={({ date, view }) => {
          // Nếu đang xem theo tháng, hiển thị số lượng task trong ngày
          if (view === "month" && tasks) {
            const tasksOnDate = tasks.filter(
              (task) =>
                new Date(task.duedate).setHours(0, 0, 0, 0) ===
                date.setHours(0, 0, 0, 0)
            );
            return tasksOnDate.length > 0 ? (
              <button className=" rounded-full bg-green-500 p-1"></button>
            ) : null;
          }
        }}
      />

      {/* Task list for selected date */}
      {renderTasksForSelectedDate()}

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

export default CalendarView;
