import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!isLoggedIn && !user) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, user, router, redirectTo]);

  return { user, isLoggedIn };
}
