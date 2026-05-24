import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Storage } from "../utils/storage";
import { AuthService } from "../api/http/services/auth.service";
import { User } from "@/api/http/types/user";
import { AuthStatus } from "@/api/http/types/auth";

interface AuthContextProps {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  verifyEmail: (email: string) => Promise<boolean>;
  verifyCode: (code: string) => Promise<boolean>;
  setPassword: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const data = await AuthService.me();
      const currentUser = data.user;

      setUser(currentUser);

      if (currentUser.onboardingRequired) {
        setStatus("onboardingRequired");
        return;
      }

      if (!currentUser.password) {
        setStatus("passwordRequired");
        return;
      }

      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const loadUser = useCallback(async () => {
    if (status !== "checking") return;

    try {
      const token = await Storage.get("access_token");

      if (!token) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }

      await refreshUser();
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [status, refreshUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await AuthService.login({
        authType: "password",
        email,
        password,
      });

      await Storage.set("access_token", data.Auth.accessToken);
      await Storage.set("refresh_token", data.Auth.refreshToken);
      await refreshUser();

      return true;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await AuthService.register({
        name,
        email,
        password,
      });

      await Storage.set("access_token", response.Auth.accessToken);
      await Storage.set("refresh_token", response.Auth.refreshToken);
      await refreshUser();

      return true;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return false;
    }
  };

  const verifyEmail = async (email: string): Promise<boolean> => {
    try {
      await AuthService.verifyEmail({ email });
      setPendingEmail(email);
      setStatus("emailVerified");
      return true;
    } catch {
      return false;
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    try {
      if (!pendingEmail) return false;

      const data = await AuthService.verifyCode({
        email: pendingEmail,
        code,
      });

      return data.User.verifyEmail ?? false;
    } catch {
      return false;
    }
  };

  const setPassword = async (password: string): Promise<boolean> => {
    try {
      if (!pendingEmail) return false;

      await AuthService.setPassword({
        email: pendingEmail,
        password,
      });

      await refreshUser();
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await Storage.remove("access_token");
    await Storage.remove("refresh_token");

    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        login,
        register,
        verifyEmail,
        verifyCode,
        setPassword,
        logout,
        loadUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
