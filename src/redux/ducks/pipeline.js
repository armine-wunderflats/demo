import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

const initialState = {
  isLoading: false,
  loadingMore: false,
  noMoreStartups: false,
  startups: [],
  page: 0,
  nextPage: 1,
};

const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {
    getInterestedStartups: (state) => ({ ...state, isLoading: true }),
    getInterestedStartupsSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      startups: action.payload,
      error: null,
    }),
    getInterestedStartupsFail: (state, action) => ({
      ...state,
      isLoading: false,
      error: action.payload,
    }),
    getMoreStartups: (state) => ({
      ...state,
      loadingMore: true,
      page: state.page + 1,
      nextPage: state.nextPage + 1,
    }),
    noMoreStartups: (state) => ({
      ...state,
      noMoreStartups: true,
      loadingMore: false,
    }),
    getMoreStartupsSuccess: (state, action) => ({
      ...state,
      loadingMore: false,
      startups: [...state.startups, ...action.payload],
      error: null,
    }),
    getMoreStartupsFail: (state, action) => ({
      ...state,
      loadingMore: false,
      error: action.payload,
    }),
  },
});

const pipelineReducer = pipelineSlice.reducer;

export const getInterestedStartups = (page = 0, size = 10) => {
  return (dispatch) => {
    dispatch(pipelineSlice.actions.getInterestedStartups());

    axios
      .get(`${API_URL}/startups/interested?page=${page}&size=${size}`)
      .then((r) => {
        return r.data;
      })
      .then((data) => {
        dispatch(pipelineSlice.actions.getInterestedStartupsSuccess(data));
      })
      .catch((error) =>
        dispatch(pipelineSlice.actions.getInterestedStartupsFail(error))
      );
  };
};

export const getMoreStartups = (page, size = 10) => {
  return (dispatch) => {
    dispatch(pipelineSlice.actions.getMoreStartups());

    axios
      .get(`${API_URL}/startups/interested?page=${page}&size=${size}`)
      .then((r) => {
        return r.data;
      })
      .then((data) => {
        if (data == undefined || data.length == 0) {
          return dispatch(pipelineSlice.actions.noMoreStartups());
        }
        dispatch(pipelineSlice.actions.getMoreStartupsSuccess(data));
      })
      .catch((error) =>
        dispatch(pipelineSlice.actions.getMoreStartupsFail(error))
      );
  };
};

export default pipelineReducer;
