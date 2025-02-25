import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Imports nécessaires à l'utilisation du store (redux)
import {Provider} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// import de notre reducer user (les datas stockées dans le store de l'utilisateur)
import user from './reducers/user';

// import des éléments nécessaires à persistor redux 
// (ce qui permet que les données du store restent après rafraichissement 
// de la page, les données sont vraiment stockées par l'utilisateur dans son navigateur)
import { persistStore, persistReducer } from 'redux-persist'; // les config qui permettent au store et aux reducers de 'rester'
import { PersistGate } from 'redux-persist/integration/react'; // la balise qui contient le persistor
import storage from 'redux-persist/lib/storage'; // le storage qui est un store amélioré du coup (je schématise)
import { combineReducers } from '@reduxjs/toolkit'; // pouvoir ranger tous les reducers dans le même stockage

import Head from 'next/head'; // le header pour le SEO

const reducers = combineReducers({user}); // déclaration de tous nos reducers

const persistConfig = {key: 'PJBG', storage}; // le nom du storage dans le nav de l'utilisateur : le nom de notre site

const store = configureStore({ // déclarer le store avec les premiers imports
    reducer: persistReducer(persistConfig, reducers),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

const persistor = persistStore(store); // déclarer le store persistant en utilisant les imports

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        console.log(`Navigated to ${router.pathname}`);
    }, [router.pathname]);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Head>
                    <title>PJBG</title>
                </Head>
                <Component {...pageProps} />
            </PersistGate>
        </Provider>
);
}

export default MyApp;
