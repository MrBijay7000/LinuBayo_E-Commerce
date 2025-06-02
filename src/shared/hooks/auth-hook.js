import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null); // Initialize as null
  const [userId, setUserId] = useState(false);
  const [role, setRole] = useState(null);

  const login = useCallback((uid, token, role, expirationDate) => {
    // Added role parameter
    setToken(token);
    setUserId(uid);
    setRole(role);

    // Calculate expiration date - 1 hour from now if not provided
    const tokenExpDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        role,
        expiration: tokenExpDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      // Check if expiration date exists and is valid
      const expirationDate = storedData.expiration
        ? new Date(storedData.expiration)
        : new Date(new Date().getTime() + 1000 * 60 * 60); // Default to 1 hour if missing

      if (!storedData.expiration || expirationDate > new Date()) {
        login(
          storedData.userId,
          storedData.token,
          storedData.role || "user", // Default role if missing
          expirationDate
        );
      } else {
        logout(); // Token expired
      }
    }
  }, [login, logout]);

  return { token, login, logout, userId, role };
};
