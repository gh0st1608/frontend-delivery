import React, { createContext, useContext, useEffect, useState } from "react";
import { Storage } from "../utils/storage";
import { AuthService } from "../api/services/auth.service";
import { useRootNavigationState } from "expo-router";

interface AuthContextProps {
  user: any;
  loading: boolean;
  authenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  verifyEmail: (email: string) => Promise<boolean>;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const rootNav = useRootNavigationState();

  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // LOAD USER SESSION
  // ---------------------------------------
  const loadUser = async () => {
    const accessToken = await Storage.get("access_token");

    setAuthenticated(!!accessToken);
    setLoading(false);
  };

  useEffect(() => {
    if (!rootNav?.key) return;
    loadUser();
  }, [rootNav]);

  // ---------------------------------------
  // LOGIN (NO NAVEGACIÓN)
  // ---------------------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await AuthService.login({
        authType: "password",
        email,
        password,
      });

      const { accessToken, refreshToken } = data.Auth;

      await Storage.set("access_token", accessToken);
      await Storage.set("refresh_token", refreshToken);

      setAuthenticated(true);
      setUser({ email });

      return true; // El screen decide qué hacer
    } catch (err) {
      console.log("❌ Error login:", err);
      return false;
    }
  };

  // ---------------------------------------
  // REGISTER (NO NAVEGACIÓN)
  // ---------------------------------------
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const data = await AuthService.register({ name, email, password });

      // "data" tiene solo Data, sin Error
      const { id } = data.User;

      setAuthenticated(true);
      setUser({ name, id });

      return true; // el screen decide
    } catch (err) {
      console.log("❌ Error register:", err);
      return false;
    }
  };

  // ---------------------------------------
  // VERIFIED EMAIL (NO NAVEGACIÓN)
  // ---------------------------------------
  const verifyEmail = async (email: string): Promise<boolean> => {
    try {
      const data = await AuthService.verifyEmail({ email });
      // data === ApiResponse<VerifiedEmailResponse>["Data"]

      return data.User.verifyEmail ?? false;
    } catch (err) {
      // err es BaseResponseError lanzado desde el service
      return false;
    }
  };

  const verifyCode = async (codeMailing: string): Promise<boolean> => {
    try {
      const data = await AuthService.verifyCode({ codeMailing });
      // data === ApiResponse<VerifiedEmailResponse>["Data"]

      return data.User.verifyEmail ?? false;
    } catch (err) {
      // err es BaseResponseError lanzado desde el service
      return false;
    }
  };

  // ---------------------------------------
  // LOGOUT (NO NAVEGACIÓN)
  // ---------------------------------------
  const logout = async () => {
    await Storage.remove("access_token");
    await Storage.remove("refresh_token");

    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        login,
        register,
        verifyEmail,
        verifyCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
