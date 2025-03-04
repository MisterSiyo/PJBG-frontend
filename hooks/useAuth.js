import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Hook personnalisé pour récupérer l'utilisateur connecté depuis Redux
 * @returns {Object} { user, loading, error }
 */
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer l'utilisateur depuis le store Redux
  const userData = useSelector((state) => state.user.value);

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = userData && userData.token !== null;

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà chargé dans Redux
    if (userData !== undefined) {
      setLoading(false);
    }
  }, [userData]);

  return {
    user: userData,
    isAuthenticated,
    token: userData?.token,
    loading,
    error,
  };
}

export default useAuth;
