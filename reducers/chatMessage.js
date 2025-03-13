// on ne s'en sert plus

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = { // notre valeur initiale de messages dans le store, initialisée à tableau vide tant qu'on est pas dans un projet
//   value: [],
// };

// export const chatMessageSlice = createSlice({
//   name: 'chatMessage',
//   initialState,
//   reducers: {
//     loadMessages: (state, action) => { // loader les messages dans le storage
//       state.value = action.payload;
//     },
//     addChatMessage: (state, action) => {
//       state.value.push(action.payload) // pas sur qu'il faudrait pas tout recharger simplement aussi, ne pas oublier de vider ce reducer quand on quitte la page
//     }
//   },
// });

// export const { loadMessages } = chatMessageSlice.actions;
// export default chatMessageSlice.reducer;