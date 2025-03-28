import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // notre valeur initiale de user dans le store, initialisée à objet vide
  value: {
    token: null,
    username: null,
    role: null,
    email: null,
    name: null,
    surname: null,
    address: null,
    studio: null,
    socialLinks: [],
    followedProjects: [],
    createdProjects: [],
    fundedProjects: [],
    userFavorites: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      console.log("Redux: setRole", action.payload);
      state.value.role = action.payload;
    },

    addUserToStore: (state, action) => {
      state.value = action.payload;
    },

    toggleFollowedProject: (state, action) => {
      const { projectId } = action.payload;

      if (!state.value.followedProjects) {
        state.value.followedProjects = [];
      }

      const isFollowing = state.value.followedProjects.includes(projectId);

      if (isFollowing) {
        state.value.followedProjects = state.value.followedProjects.filter(
          (id) => id !== projectId
        );
      } else {
        state.value.followedProjects.push(projectId);
      }
    },

    setFollowedProjects: (state, action) => {
      state.value = {
        ...state.value,
        followedProjects: JSON.parse(JSON.stringify(action.payload))
      };
    },

    addGoogleUserToStore: (state, action) => {
      // ajouter le user au storage, contiendra les données récupérées depuis la BDD une fois le token envoyé
      console.log("Redux: addUserToStore", {
        token: action.payload.token?.substring(0, 10) + "...",
        username: action.payload.username,
      });

      // S'assurer que tous les champs nécessaires sont présents
      const userData = {
        ...initialState.value, // Inclure tous les champs par défaut
        ...action.payload, // Écraser avec les données fournies
      };

      // Assurer que l'action a au moins un token et un nom d'utilisateur
      if (!userData.token) {
        console.error("Redux: Tentative d'ajout d'un utilisateur sans token!");
        return; // Ne pas modifier l'état si le token est manquant
      }

      // Mettre à jour l'état avec les données validées
      state.value = userData;
      console.log("Redux: État mis à jour avec succès");
    },

    removeUserFromStore: (state, action) => {
      // retirer le user du storage lors de l'appui sur le bouton déconnexion
      state.value = {
        token: null,
        username: null,
        role: null,
        email: null,
        name: null,
        surname: null,
        address: {},
        studio: null,
        socialLinks: [],
        followedProjects: [],
        createdProjects: [],
        fundedProjects: [],
        userFavorites: [],
      };
    },
    updateUser: (state, action) => {
      // Mettez à jour le profil de l'utilisateur dans le store
      console.log("Redux: updateUser", action.payload);
      state.value = { ...state.value, ...action.payload };
    },
    updateUserAddress: (state, action) => {
      console.log("Redux: updateUserAddress", action.payload);
      state.value.address = action.payload; // Mise à jour de l'adresse de l'utilisateur
    },
    updateUserSocialLinks: (state, action) => {
      console.log("Redux: updateUserSocialLinks", action.payload);
      state.value.socialLinks = action.payload; // Mise à jour des réseaux sociaux
    },
    updateBacking: (state, action) => {
      state.value.fundedProjects = action.payload;
    }
  },
});

export const {
  addUserToStore,
  removeUserFromStore,
  setRole,
  updateUser,
  updateUserAddress,
  updateUserSocialLinks,
  toggleFollowedProject,
  setFollowedProjects,
  updateBacking,
} = userSlice.actions;
export default userSlice.reducer;
