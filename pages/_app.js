import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useRouter } from "next/router";

// Imports nécessaires à l'utilisation du store (redux)
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import userReducer from "../reducers/user";

import Head from "next/head"; // le header pour le SEO
import Header from "../components/Header";
import AuthHandler from "../components/AuthHandler";


// Configuration de redux-persist
console.log("Configuration de redux-persist");
const persistConfig = {
  key: "pjbg-root",
  storage,
  whitelist: ["user"], // On ne persiste que le reducer user
  debug: true,
};

// Combiner les reducers
const reducers = combineReducers({
  user: userReducer,
  // Autres reducers si nécessaires
});

// Créer le reducer persistent
const persistedReducer = persistReducer(persistConfig, reducers);

// Configurer le store avec le reducer persistant
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions de redux-persist dans les vérifications de sérialisation
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Créer le persistor
const persistor = persistStore(store, null, () => {
  console.log("Rehydratation redux-persist terminée");
  console.log("État initial:", store.getState());
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    console.log(`Navigated to ${router.pathname}`);
  }, [router.pathname]);

  console.log("Initialisation de l'application");

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <title>PJBG</title>
          </Head>
          <Header />
          <AuthHandler />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
