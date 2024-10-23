import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import xanderSlice from "./Slices/xanderSlice";
import noPersistXanderSlice from "./Slices/noPersistXanderSlice";

const reducers = combineReducers({
  xanderSlice: xanderSlice,
  noPersistXanderSlice: noPersistXanderSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["xanderSlice"],
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
