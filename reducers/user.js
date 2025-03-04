import { createSlice } from '@reduxjs/toolkit';

const initialState = { // notre valeur initiale de user dans le store, initialisée à objet vide
  value: {
    token: null,
    username: null,
    role: null,
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
    addUserToStore: (state, action) => { // ajouter le user au storage, contiendra les données récupérées depuis la BDD une fois le token envoyé
      state.value = action.payload;
    },
    removeUserFromStore: (state, action) => { // retirer le user du storage lors de l'appui sur le bouton déconnexion
      state.value = {
        token: null,
        username: null,
        role: null,
        followedProjects: [],
        createdProjects: [],
        fundedProjects: [],
        preferences: [],
        secondChoices: [],
        restrictions: [],
        appliedProjects: [],
        developpedProjects: []
      }
    }
  },
});



export const { addUserToStore, removeUserFromStore } = userSlice.actions;
export default userSlice.reducer;