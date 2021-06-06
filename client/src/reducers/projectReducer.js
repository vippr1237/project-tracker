import {
  OWNPROJECTS_LOADED_SUCCESS,
  OWNPROJECTS_LOADED_FAIL,
  GUESSPROJECTS_LOADED_SUCCESS,
  GUESSPROJECTS_LOADED_FAIL,
  ADD_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  UPDATE_MEMBERS,
  FIND_PROJECT_SUCCESS,
  FIND_PROJECT_FAIL,
} from "../contexts/constants";

export const projectReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case OWNPROJECTS_LOADED_SUCCESS:
      return {
        ...state,
        ownprojects: payload,
        projectsLoading: false,
      };

    case OWNPROJECTS_LOADED_FAIL:
      return {
        ...state,
        ownprojects: [],
        projectsLoading: false,
      };
    case GUESSPROJECTS_LOADED_SUCCESS:
      return {
        ...state,
        guessprojects: payload,
        projectsLoading: false,
      };
    case GUESSPROJECTS_LOADED_FAIL:
      return {
        ...state,
        guessproject: [],
        projectsLoading: false,
      };

    case ADD_PROJECT:
      return {
        ...state,
        ownprojects: [payload, ...state.ownprojects],
      };

    case DELETE_PROJECT:
      return {
        ...state,
        ownprojects: state.ownprojects.filter(
          (project) => project._id !== payload
        ),
      };

    case FIND_PROJECT_SUCCESS:
      return { ...state, project: payload };
    case FIND_PROJECT_FAIL:
      return { ...state, project: null };

    case UPDATE_PROJECT:
      return {
        ...state,
        project: payload,
      };
    case UPDATE_MEMBERS:
      return {
        ...state,
        project: payload,
      };

    default:
      return state;
  }
};
