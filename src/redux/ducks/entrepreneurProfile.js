import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";
import store from "../store";
import { updateUserData } from "../ducks/user";
import { showNotification } from "../../helpers/notificationHelper";

const initialState = {
  isLoading: false,
  isModalOpen: false,
  isResetting: false,
  photoError: false,
  profileData: null,
};

const entrepreneurProfileSlice = createSlice({
  name: "entrepreneurProfile",
  initialState,
  reducers: {
    save: (state) => ({
      ...state,
    }),
    openModal: (state) => ({
      ...state,
      isModalOpen: true,
    }),
    closeModal: (state) => ({
      ...state,
      isModalOpen: false,
    }),
    togglePhotoError: (state, action) => ({
      ...state,
      photoError: action.payload,
    }),
    setLocation: (state, action) => ({
      ...state,
      profileData: {
        ...state.profileData,
        locations: [action.payload],
      },
    }),
    setTimeZone: (state, action) => ({
      ...state,
      profileData: {
        ...state.profileData,
        timeZone: action.payload,
      },
    }),
    setResidency: (state, action) => ({
      ...state,
      profileData: {
        ...state.profileData,
        residency: action.payload,
      },
    }),
    setTextInput: (state, action) => ({
      ...state,
      profileData: {
        ...state.profileData,
        ...action.payload,
      },
    }),
    getProfileData: (state) => ({
      ...state,
      isLoading: true,
    }),
    getProfileDataSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      profileData: action.payload,
    }),
    getProfileDataFail: (state, action) => ({
      ...state,
      isLoading: false,
      error: action.payload,
    }),
    updateProfile: (state) => ({
      ...state,
      isLoading: true,
    }),
    updateProfileSuccess: (state) => ({
      ...state,
      isLoading: false,
    }),
    updateProfileFail: (state) => ({
      ...state,
      isLoading: false,
    }),
    resetProfile: (state) => ({
      ...state,
      isLoading: true,
      isResetting: true,
    }),
    resetProfileSuccess: (state, action) => ({
      ...state,
      profileData: action.payload,
      isResetting: false,
    }),
    resetProfileFail: (state, action) => ({
      ...state,
      isResetting: false,
      error: action.payload,
    }),
    handleFieldEdit: (state, action) => {
      const { editingField, text, startupId } = action.payload;

      return startupId //case when the product doesn't exist yet, it is yet to be created
        ? {
            ...state,
            profileData: {
              ...state.profileData,
              startups: state.profileData.startups.map((startup) =>
                startup.id === startupId
                  ? {
                      ...startup,
                      [editingField]: text,
                    }
                  : startup
              ),
            },
          }
        : {
            ...state,
            profileData: {
              ...state.profileData,
              startups: [
                {
                  [editingField]: text,
                },
              ],
            },
          };
    },
    handleFieldSave: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    handleFieldSaveSuccess: (state, action) => ({
      ...state,
      profileData: {
        ...state.profileData,
        startups: state.profileData.startups.map((startup) =>
          startup.id === action.payload.id ? action.payload : startup
        ),
      },
    }), // todo дописать это, остальное по идее норм, кроме rich editor
    handleFieldSaveFail: (state, action) => ({
      ...state,
      isLoading: false,
      error: action.payload,
    }),
  },
});

const initialPrifileData = {
  id: null,
  photoUrl: null,
  bio: null,
  availableVia: null,
  highlights: null,
  residency: null,
  locations: null,
  timeZone: null,
  completed: null,
};

const entrepreneurProfileReducer = entrepreneurProfileSlice.reducer;

export const save = (values) => {
  let arr = values.split(" ");

  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.save());
    dispatch(
      updateUserData({
        firstName: arr[0],
        lastName: arr[1],
      })
    );

    dispatch(updateProfile(true));
  };
};

export const getProfileData = (id = "current") => {
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.getProfileData());
    axios
      .get(`${API_URL}/entrepreneur-profiles/${id}`)
      .then((r) => {
        return r.data;
      })
      .then((data) => {
        dispatch(entrepreneurProfileSlice.actions.getProfileDataSuccess(data));
      })
      .catch((error) => {
        dispatch(entrepreneurProfileSlice.actions.getProfileDataFail(error));
      });
  };
};

export const handleFieldEdit = (editingField, text, startupId) => (
  dispatch
) => {
  dispatch(
    entrepreneurProfileSlice.actions.handleFieldEdit({
      editingField,
      text,
      startupId,
    })
  );
};

export const handleFieldSave = (editingField, startupId) => (dispatch) => {
  const state = store.getState();

  dispatch(entrepreneurProfileSlice.actions.handleFieldSave());

  if (startupId) {
    axios
      .put(`${API_URL}/startups/${startupId}`, {
        name: state.profileData.startups.find(
          (startup) => startup.id === startupId
        ).name,
        [editingField]: state.profileData.startups[0][editingField],
      })
      .then((res) => {
        return res.data;
      })
      .then((startup) => {
        dispatch(
          entrepreneurProfileSlice.actions.handleFieldSaveSuccess(startup)
        );
      })
      .catch((error) => {
        dispatch(entrepreneurProfileSlice.actions.handleFieldSaveFail(error));
      });
  } else {
    axios
      .post(`${API_URL}/startups`, {
        name: "Placeholder", //TODO discuss and change this, how to create if name is mandatory
        [editingField]: state.profileData.startups[0][editingField],
      })
      .then((res) => {
        return res.data;
      })
      .then((startup) => {
        dispatch(
          entrepreneurProfileSlice.actions.handleFieldSaveSuccess(startup)
        );
      })
      .catch((error) => {
        dispatch(entrepreneurProfileSlice.actions.handleFieldSaveFail(error));
      });
  }
};

export const updateProfile = (save = false) => {
  const state = store.getState();

  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.updateProfile());

    axios
      .put(
        `${API_URL}/entrepreneur-profiles/current`,
        state.entrepreneurProfile.profileData
      )
      .then((r) => {
        return r.data;
      })
      .then((data) => {
        dispatch(entrepreneurProfileSlice.actions.updateProfileSuccess(data));
        if (save) {
          showNotification("success", "notification.saved");
        }
      })
      .catch((error) => {
        dispatch(entrepreneurProfileSlice.actions.updateProfileFail(error));
        if (save) {
          showNotification("error", "notification.somethingWentWrong");
        }
      });
  };
};

export const resetProfile = () => {
  const state = store.getState();
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.resetProfile());

    axios
      .put(`${API_URL}/entrepreneur-profiles/current`, {
        ...initialPrifileData,
        id: state.entrepreneurProfile.profileData.id,
      })
      .then((r) => {
        return r.data;
      })
      .then((data) => {
        dispatch(entrepreneurProfileSlice.actions.resetProfileSuccess(data));
      })
      .catch((error) => {
        dispatch(entrepreneurProfileSlice.actions.updateProfileFail(error));
      });
  };
};

export const setTextInput = (object) => {
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.setTextInput(object));
  };
};

export const openModal = () => {
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.openModal());
  };
};

export const closeModal = () => {
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.closeModal());
  };
};

export const togglePhotoError = (value) => {
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.togglePhotoError(value));
  };
};

const getCityObject = (input) => {
  if (typeof input === "string") {
    return {
      cityName: input,
      city: null,
      country: null,
      region: null,
    };
  } else {
    return {
      cityName: input.name,
      city: {
        id: input.id,
        name: input.name,
        countryId: input.countryId,
        regionId: input.regionId,
        country: input.country,
        region: input.region,
      },
      country: input.country,
      region: input.region,
    };
  }
};

export const setLocation = (location) => {
  return (dispatch) => {
    dispatch(
      entrepreneurProfileSlice.actions.setLocation(getCityObject(location))
    );
  };
};

export const setTimeZone = (timeZone) => {
  return (dispatch) => {
    dispatch(entrepreneurProfileSlice.actions.setTimeZone(timeZone));
  };
};

export const setResidency = (residency) => {
  return (dispatch) => {
    dispatch(
      entrepreneurProfileSlice.actions.setResidency(getCityObject(residency))
    );
  };
};

export default entrepreneurProfileReducer;
