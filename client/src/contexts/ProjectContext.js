import { createContext, useReducer, useState } from "react";
import { projectReducer } from "../reducers/projectReducer";
import {
  OWNPROJECTS_LOADED_FAIL,
  OWNPROJECTS_LOADED_SUCCESS,
  GUESSPROJECTS_LOADED_FAIL,
  GUESSPROJECTS_LOADED_SUCCESS,
  ADD_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  FIND_PROJECT_SUCCESS,
  FIND_PROJECT_FAIL,
  UPDATE_MEMBERS,
} from "./constants";
import axios from "axios";

export const ProjectContext = createContext();

const ProjectContextProvider = ({ children }) => {
  // State
  const [projectState, dispatch] = useReducer(projectReducer, {
    project: null,
    ownprojects: [],
    guessprojects: [],
    projectsLoading: true,
  });

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    note: "",
    type: null,
  });

  // Get all posts
  const getOwnProjects = async () => {
    try {
      const response = await axios.get(`/api/ownproject`);
      if (response.data.success) {
        dispatch({
          type: OWNPROJECTS_LOADED_SUCCESS,
          payload: response.data.ownprojects,
        });
      }
    } catch (error) {
      dispatch({ type: OWNPROJECTS_LOADED_FAIL });
    }
  };

  const getGuessProjects = async () => {
    try {
      const response = await axios.get(`/api/guessproject`);
      if (response.data.success) {
        dispatch({
          type: GUESSPROJECTS_LOADED_SUCCESS,
          payload: response.data.guessprojects,
        });
      }
    } catch (error) {
      dispatch({ type: GUESSPROJECTS_LOADED_FAIL });
    }
  };

  // Add post
  const addProject = async (newProject) => {
    try {
      const response = await axios.post(`/api/ownproject`, newProject);
      if (response.data.success) {
        dispatch({ type: ADD_PROJECT, payload: response.data.project });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Delete post
  const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`/api/project/${projectId}`);
      if (response.data.success)
        dispatch({ type: DELETE_PROJECT, payload: projectId });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Find post when user is updating post
  const findProject = async (projectId) => {
    try {
      const response = await axios.get(`/api/project/${projectId}`);
      if (response.data.success) {
        dispatch({
          type: FIND_PROJECT_SUCCESS,
          payload: response.data.project,
        });
        return response.data;
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: FIND_PROJECT_FAIL });
    }
  };

  // Update post
  const updateProject = async (updatedProject) => {
    try {
      const response = await axios.put(
        `/api/project/${updatedProject.projectId}`,
        { projectName: updatedProject.projectName }
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_PROJECT, payload: response.data.project });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  const updateMembers = async (updatedProject) => {
    try {
      const response = await axios.post(`/api/project/${updatedProject._id}`, {
        members: updatedProject.members,
      });
      if (response.data.success) {
        dispatch({ type: UPDATE_MEMBERS, payload: response.data.project });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Post context data
  const projectContextData = {
    projectState,
    getOwnProjects,
    getGuessProjects,
    showAddProjectModal,
    setShowAddProjectModal,
    showUpdateProjectModal,
    setShowUpdateProjectModal,
    addProject,
    showToast,
    setShowToast,
    deleteProject,
    findProject,
    updateProject,
    updateMembers,
  };

  return (
    <ProjectContext.Provider value={projectContextData}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
