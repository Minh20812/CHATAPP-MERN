import { useEffect, useState } from "react";
import { Transition, Listbox, RadioGroup } from "@headlessui/react";
import { Fragment } from "react";
import { useAddTaskMutation } from "../../../redux/api/taskApiSlice";
import { useGetAllProjectsQuery } from "../../../redux/api/projectApiSlice";
import {
  useGetAllLabelsQuery,
  useAddLabelMutation,
} from "../../../redux/api/labelApiSlice";
import AddProject from "./component/AddProject";
import AddLabel from "./component/AddLabels";
import MultiSelectLabelDropdown from "./component/MultiSelectedLabel";

const priorities = [
  { name: "Low", value: "low" },
  { name: "Medium", value: "medium" },
  { name: "High", value: "high" },
];

const repeatOptions = [
  { name: "None", value: "none" },
  { name: "Next 24 hours", value: "24h" },
  { name: "Weekly", value: "weekly" },
  { name: "Monthly", value: "monthly" },
  { name: "Yearly", value: "yearly" },
];

const MainAddTask = () => {
  const {
    data: projects,
    error: projectError,
    isLoading: isProjectLoading,
    refetch: refetchProjects,
  } = useGetAllProjectsQuery();

  const {
    data: labels,
    error: labelError,
    isLoading: isLabelLoading,
    refetch: refetchLabels,
  } = useGetAllLabelsQuery();

  const [addTask] = useAddTaskMutation();
  const [addLabel] = useAddLabelMutation();
  const [taskname, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([{ name: "" }]);
  const [duedate, setDuedate] = useState("");
  const [priority, setPriority] = useState(priorities[0]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [reminder, setReminder] = useState("");
  const [location, setLocation] = useState("");
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [repeatOption, setRepeatOption] = useState(repeatOptions[0]);
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [isAddingNewLabel, setIsAddingNewLabel] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [reminderError, setReminderError] = useState("");

  const validateReminder = (reminderDate, dueDate) => {
    if (!reminderDate || !dueDate) return true;

    const reminderDateTime = new Date(reminderDate);
    const dueDateTime = new Date(dueDate);

    return reminderDateTime < dueDateTime;
  };

  const handleReminderChange = (e) => {
    const newReminder = e.target.value;
    setReminder(newReminder);

    if (duedate && newReminder) {
      if (!validateReminder(newReminder, duedate)) {
        setReminderError("Reminder time must be before due date");
      } else {
        setReminderError("");
      }
    }
  };

  const handleDueDateChange = (e) => {
    const newDueDate = e.target.value;
    setDuedate(newDueDate);

    if (reminder && newDueDate) {
      if (!validateReminder(reminder, newDueDate)) {
        setReminderError("Reminder time must be before due date");
      } else {
        setReminderError("");
      }
    }
  };

  const handleProjectChange = (e) => {
    const value = e.target.value;
    if (value === "add-new") {
      openProjectModal();
      setIsAddingNewProject(true);
      setSelectedProject("");
      refetchProjects();
    } else {
      setIsAddingNewProject(false);
      setSelectedProject(value);
    }
  };

  const handleLabelChange = (newSelectedLabels) => {
    setSelectedLabels(newSelectedLabels);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { name: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reminder && duedate && !validateReminder(reminder, duedate)) {
      setReminderError("Reminder time must be before due date");
      return;
    }

    const data = {
      taskname,
      description,
      subtasks,
      project: selectedProject,
      duedate,
      priority: priority.value,
      labels: selectedLabels,
      reminder: reminder ? new Date(reminder) : null,
      repeat: repeatOption.value,
      location,
      completed: false,
    };

    console.log(data);

    try {
      await addTask(data).unwrap();

      setSuccessMessage("Task added successfully!");

      setTask("");

      setDescription("");

      setSubtasks([{ name: "" }]);

      setDuedate("");

      setPriority(priorities[0]);

      setSelectedProject("");

      setSelectedLabels([]);

      setReminder("");

      setLocation("");

      setRepeatOption(repeatOptions[0]);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const openProjectModal = () => {
    setIsProjectModalOpen(true);
  };
  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  const openLabelModal = () => {
    setIsLabelModalOpen(true);
  };
  const closeLabelModal = () => {
    setIsLabelModalOpen(false);
  };

  const handleProjectAdded = async (newProjectId) => {
    await refetchProjects();
    setSelectedProject(newProjectId);
    setIsProjectModalOpen(false);
    setIsAddingNewProject(false);
  };

  const handleLabelAdded = async (newLabelId) => {
    await refetchLabels();
    setSelectedLabels((prev) => [...prev, newLabelId]);
    setIsLabelModalOpen(false);
  };

  useEffect(() => {
    if (projects) {
      console.log("Projects were fetched");
    }
    if (projectError) {
      console.log("Error fetching projects", projectError);
    }
  }, [projects, projectError]);

  useEffect(() => {
    if (labels) {
      console.log("Labels were fetched");
    }
    if (labelError) {
      console.log("Error fetching labels", labelError);
    }
  }, [labels, labelError]);

  if (isProjectLoading || isLabelLoading) {
    return <div>Loading...</div>;
  }

  if (projectError || labelError) {
    return (
      <div>
        Error fetching data: {projectError?.message || labelError?.message}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full">
        <h2 className="text-2xl font-semibold mb-6">Add New Task</h2>

        {/* Success Message */}

        {successMessage && (
          <div className="mb-4 text-green-600">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="lg:flex gap-10">
            <div className=" gap-10">
              {/* Task Name */}
              <div className="mb-4 flex gap-4 ">
                <label className="block text-sm font-medium text-gray-700">
                  Task Name
                </label>
                <input
                  type="text"
                  value={taskname}
                  onChange={(e) => setTask(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Description */}
              <div className="mb-4 flex gap-4 ">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Subtasks */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subtasks
                </label>
                <div className=" grid-cols-2">
                  {subtasks.map((subtask, index) => (
                    <input
                      key={`subtask-${index}`}
                      type="text"
                      value={subtask.name}
                      onChange={(e) => {
                        const newSubtasks = [...subtasks];
                        newSubtasks[index].name = e.target.value;
                        setSubtasks(newSubtasks);
                      }}
                      placeholder={`Subtask ${index + 1}`}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="text-blue-500 text-sm"
                >
                  + Add Subtask
                </button>
              </div>
            </div>
            <div className=" gap-10">
              {/* Project */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project
                </label>

                <select
                  value={isAddingNewProject ? "add-new" : selectedProject}
                  onChange={handleProjectChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Select a project
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectname}
                    </option>
                  ))}

                  <option value="add-new" onClick={() => openProjectModal()}>
                    Add New Project
                  </option>
                </select>
              </div>

              {/* Priority */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <RadioGroup value={priority} onChange={setPriority}>
                  <div className="flex gap-4">
                    {priorities.map((prio) => (
                      <RadioGroup.Option
                        key={prio.value}
                        value={prio}
                        className="cursor-pointer"
                      >
                        {({ active, checked }) => (
                          <span
                            className={`py-2 px-4 rounded-lg border ${
                              checked
                                ? "bg-indigo-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            {prio.name}
                          </span>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Due Date */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={duedate}
                  onChange={handleDueDateChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Repeat Option */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Repeat
                </label>
                <Listbox value={repeatOption} onChange={setRepeatOption}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {repeatOption.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        {`v`}
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {repeatOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option}
                            className={({ active }) =>
                              `${
                                active
                                  ? "text-white bg-indigo-600"
                                  : "text-gray-900"
                              }
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-medium" : "font-normal"
                                  } block truncate`}
                                >
                                  {option.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                    CheckIcon
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Labels */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Labels
                </label>
                <MultiSelectLabelDropdown
                  labels={labels}
                  selectedLabels={selectedLabels}
                  onChange={handleLabelChange}
                  onAddNewLabel={openLabelModal}
                />
              </div>

              {/* Reminder */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Start date
                </label>
                <div className="w-full">
                  <input
                    type="datetime-local"
                    value={reminder}
                    onChange={handleReminderChange}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${
                      reminderError ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {reminderError && (
                    <p className="mt-1 text-sm text-red-500">{reminderError}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="mb-4 flex gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2"
          >
            Add Task
          </button>
        </form>
      </div>

      <AddLabel
        isOpen={isLabelModalOpen}
        closeModal={closeLabelModal}
        onLabelAdded={handleLabelAdded}
      />

      <AddProject
        isOpen={isProjectModalOpen}
        closeModal={closeProjectModal}
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
};

export default MainAddTask;
