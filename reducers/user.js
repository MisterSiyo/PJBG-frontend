import { createSlice } from '@reduxjs/toolkit';

const initialState = { // notre valeur initiale de user dans le store, initialisée à objet vide
  value: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserToStore: (state, action) => { // ajouter le user au storage, contiendra les données récupérées depuis la BDD une fois le token envoyé
      state.value = action.payload;
    },
  },
});



export const { addUserToStore } = userSlice.actions;
export default userSlice.reducer;