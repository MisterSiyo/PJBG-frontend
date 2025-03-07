import { useEffect } from "react";
import useRequireAuth from "../hooks/useRequireAuth";

export default function ProfilePage() {
  const { user, isLoggedIn } = useRequireAuth();

  if (!isLoggedIn) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Profil de {user.username}</h1>
      {/* Afficher les informations du profil */}
    </div>
  );
}
