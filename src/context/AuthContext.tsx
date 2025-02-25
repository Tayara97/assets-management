import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("token") ? true : false;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<string | null>(localStorage.getItem("role"));

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(token);
    setIsAuthenticated(true);
    const tokenData = jwtDecode(token);
    const role =
      tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    setUser(role);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setToken(null);
    setIsAuthenticated(false);
  };

  // const scheduleTokenRefresh = (expirationTime: string) => {
  //   const timeout = new Date(expirationTime).getTime() - new Date().getTime();
  //   if (timeout > 0) {
  //     setTimeout(async () => {
  //       try {
  //         const refreshToken = localStorage.getItem("refreshToken");
  //         if (!refreshToken) throw new Error("No refresh token found");

  //         const response = await fetch(
  //           "http://localhost:5243/api/Auth/RefreshToken/RefreshToken",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ refreshToken }),
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error("Failed to refresh token");
  //         }

  //         const { token, expiration } = await response.json();
  //         login(token, refreshToken);
  //         scheduleTokenRefresh(expiration);
  //       } catch (error) {
  //         console.error("Token refresh error:", error);
  //         logout();
  //       }
  //     }, timeout);
  //   }
  // };

  // useEffect(() => {
  //   if (token) {
  //     const expiration = localStorage.getItem("tokenExpiration");
  //     if (expiration) scheduleTokenRefresh(expiration);
  //   }
  // }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;