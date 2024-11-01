import React, { useEffect, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css"; // Import CSS của gantt

const GanttChart = ({ tasks }) => {
  const [ganttTasks, setGanttTasks] = useState([]);

  useEffect(() => {
    // Chuyển đổi các task từ API thành định dạng của gantt
    if (tasks) {
      const formattedTasks = tasks.map((task) => ({
        start: new Date(task.startdate),
        end: new Date(task.duedate),
        name: task.taskname,
        id: task._id,
        type: "task",
        progress: task.progress || 0, // Giả sử mỗi task có thuộc tính progress
        isDisabled: false,
      }));
      setGanttTasks(formattedTasks);
    }
  }, [tasks]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gantt Chart</h2>
      {ganttTasks.length > 0 ? (
        <Gantt
          tasks={ganttTasks}
          viewMode={ViewMode.Month} // Chọn chế độ xem theo tháng
        />
      ) : (
        <p className="text-gray-600">No tasks available for Gantt chart.</p>
      )}
    </div>
  );
};

export default GanttChart;
