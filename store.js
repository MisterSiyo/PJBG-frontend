import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import userReducer from "./reducers/user";
import thunk from "redux-thunk";

// Debug redux-persist
console.log("Initialisation du store Redux avec persistance");

// Configuration de la persistance
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Seul le reducer 'user' sera persisté
  debug: true,
};

// Combiner les reducers
const rootReducer = combineReducers({
  user: userReducer,
  // ajoutez d'autres reducers ici si nécessaire
});

// Créer le reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurer le store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== "production",
});

// Créer le persistor pour le provider
export const persistor = persistStore(store, null, () => {
  console.log("Rehydration de Redux terminée");
  console.log("État initial:", store.getState());
});
