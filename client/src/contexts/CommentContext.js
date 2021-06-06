import { createContext, useReducer } from "react";
import { commentReducer } from "../reducers/commentReducer";
import {
  COMMENTS_LOADED_FAIL,
  COMMENTS_LOADED_SUCCESS,
  ADD_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from "./constants";
import axios from "axios";

export const CommentContext = createContext();

const CommentContextProvider = ({ children }) => {
  // State
  const [commentState, dispatch] = useReducer(commentReducer, {
    comments: [],
    commentsLoading: true,
  });

  // Get all posts
  const getComments = async (taskId) => {
    try {
      const response = await axios.get(`/api/comments/${taskId}`);
      if (response.data.success) {
        dispatch({
          type: COMMENTS_LOADED_SUCCESS,
          payload: response.data.comments,
        });
      }
    } catch (error) {
      dispatch({ type: COMMENTS_LOADED_FAIL });
    }
  };

  // Add post
  const addComment = async (newComment) => {
    try {
      const response = await axios.post(`/api/comments/${newComment.taskId}`, {
        body: newComment.body,
      });
      if (response.data.success) {
        dispatch({ type: ADD_COMMENT, payload: response.data.comment });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Delete post
  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`api/comment/${commentId}`);
      if (response.data.success)
        dispatch({ type: DELETE_COMMENT, payload: commentId });
    } catch (error) {
      console.log(error);
    }
  };

  // Update post
  const updateComment = async (updatedComment) => {
    try {
      const response = await axios.put(
        `api/comment/${updatedComment._id}`,
        updatedComment
      );
      if (response.data.success) {
        dispatch({ type: UPDATE_COMMENT, payload: response.data.comment });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Post context data
  const commentContextData = {
    commentState,
    getComments,
    addComment,
    deleteComment,
    updateComment,
  };

  return (
    <CommentContext.Provider value={commentContextData}>
      {children}
    </CommentContext.Provider>
  );
};

export default CommentContextProvider;
