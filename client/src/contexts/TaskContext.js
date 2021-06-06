import { createContext, useReducer, useState } from "react";
import { taskReducer } from "../reducers/taskReducer";
import {
  TASKS_LOADED_FAIL,
  TASKS_LOADED_SUCCESS,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  FIND_TASK,
} from "./constants";
import axios from "axios";

export const TaskContext = createContext();

const TaskContextProvider = ({ children }) => {
  // State
  const [taskState, dispatch] = useReducer(taskReducer, {
    task: null,
    tasks: [],
    taskLoading: true,
  });

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [showToastTask, setShowToastTask] = useState({
    showTask: false,
    noteTask: "",
    typeTask: null,
  });

  // Get all posts
  const getTasks = async (projectId) => {
    try {
      const response = await axios.get(`/api/tasks/${projectId}`);
      if (response.data.success) {
        dispatch({
          type: TASKS_LOADED_SUCCESS,
          payload: response.data.tasks,
        });
      }
    } catch (error) {
      dispatch({ type: TASKS_LOADED_FAIL });
    }
  };

  // Add post
  const addTask = async (newTask) => {
    try {
      const response = await axios.post(
        `/api/tasks/${newTask.projectId}`,
        newTask
      );
      if (response.data.success) {
        dispatch({ type: ADD_TASK, payload: response.data.task });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Delete post
  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`/api/task/${taskId}`);
      if (response.data.success)
        dispatch({ type: DELETE_TASK, payload: taskId });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Find post when user is updating post
  const findTask = (taskId) => {
    const task = taskState.tasks.find((task) => task._id === taskId);
    dispatch({ type: FIND_TASK, payload: task });
  };

  // Update post
  const updateTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `/api/task/${updatedTask._id}`,
        updatedTask
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_TASK, payload: response.data.task });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Post context data
  const taskContextData = {
    taskState,
    getTasks,
    showAddTaskModal,
    setShowAddTaskModal,
    showUpdateTaskModal,
    setShowUpdateTaskModal,
    addTask,
    showToastTask,
    setShowToastTask,
    deleteTask,
    findTask,
    updateTask,
  };

  return (
    <TaskContext.Provider value={taskContextData}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
