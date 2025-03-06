import { createSlice } from '@reduxjs/toolkit';

const initialState = { // notre valeur initiale de user dans le store, initialisée à objet vide
  value: {
    token: null,
    username: null,
    role: null,
    email: null,           // Ajout de l'email
    name: null,            // Ajout du prénom
    surname: null,         // Ajout du nom de famille
    address: null,         // Ajout de l'adresse postale
    socialLinks: [],       // Ajout des liens sociaux
    followedProjects: [],
    createdProjects: [],
    fundedProjects: [],
    preferences: [],
    secondChoices: [],
    restrictions: [],
    appliedProjects: [],
    developpedProjects: []
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.value.role = action.payload;
    },
    addUserToStore: (state, action) => { // ajouter le user au storage, contiendra les données récupérées depuis la BDD une fois le token envoyé
      state.value = action.payload;
    },
    removeUserFromStore: (state, action) => { // retirer le user du storage lors de l'appui sur le bouton déconnexion
      state.value = {
        token: null,
        username: null,
        role: null,
        email: null,
        name: null,
        surname: null,
        address: {},
        socialLinks: [],
        followedProjects: [],
        createdProjects: [],
        fundedProjects: [],
        preferences: [],
        secondChoices: [],
        restrictions: [],
        appliedProjects: [],
        developpedProjects: []
      };
    },
    updateUser: (state, action) => {// Mettez à jour le profil de l'utilisateur dans le store
      state.value = { ...state.value, ...action.payload };
    },
    updateUserAddress: (state, action) => {
      state.value.address = action.payload; // Mise à jour de l'adresse de l'utilisateur
    },
    updateUserSocialLinks: (state, action) => {
      state.value.socialLinks = action.payload; // Mise à jour des réseaux sociaux
  },
},
});

export const { addUserToStore, removeUserFromStore, setRole, updateUser, updateUserAddress, updateUserSocialLinks } = userSlice.actions;
export default userSlice.reducer;