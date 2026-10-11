import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionEvents } from "../utils/session-events";
import { TokenStorage } from "../utils/token-storage";
import { refreshSession, revokeSession, storeSession } from "../api/http/session";
import { AuthService } from "../api/http/services/auth.service";
import { User } from "@/api/http/types/user";
import { AuthStatus } from "@/api/http/types/auth";
import { useCartStore } from "@/store/car-store";

// Todas las acciones lanzan un Error con el mensaje del backend cuando fallan,
// para que cada pantalla pueda mostrarlo.
interface AuthContextProps {
  user: User | null;
  status: AuthStatus;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (email: string) => Promise<void>;
  resendCode: () => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  const clearSession = useCallback(() => {
    useCartStore.getState().clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await AuthService.me();
      const currentUser = data.user;

      setUser(currentUser);

      if (currentUser.onboardingRequired) {
        setStatus("onboardingRequired");
        return;
      }

      if (!currentUser.hasPassword) {
        setStatus("passwordRequired");
        return;
      }

      setStatus("authenticated");
    } catch {
      clearSession();
    }
  }, [clearSession]);

  // Al abrir la app no hay access token (vive en memoria): la sesión se
  // restaura con el refresh token (SecureStore en móvil, cookie en web).
  const loadUser = useCallback(async () => {
    if (status !== "checking") return;

    try {
      await refreshSession();
      await refreshUser();
    } catch {
      await TokenStorage.clear();
      clearSession();
    }
  }, [status, refreshUser, clearSession]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // 🔐 El interceptor HTTP avisa cuando el token expiró (401)
  useEffect(() => SessionEvents.onUnauthorized(clearSession), [clearSession]);

  const login = async (email: string, password: string) => {
    const data = await AuthService.login({
      authType: "password",
      email,
      password,
    });

    await storeSession(data);
    await refreshUser();
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await AuthService.register({
      name,
      email,
      password,
    });

    await storeSession(response);
    await refreshUser();
  };

  const verifyEmail = async (email: string) => {
    await AuthService.verifyEmail({ email });
    setPendingEmail(email);
    setPendingCode(null);
    setStatus("emailVerified");
  };

  const resendCode = async () => {
    if (!pendingEmail) {
      throw new Error("Vuelve a ingresar tu correo.");
    }

    await AuthService.verifyEmail({ email: pendingEmail });
  };

  const verifyCode = async (code: string) => {
    if (!pendingEmail) {
      throw new Error("Vuelve a ingresar tu correo.");
    }

    const data = await AuthService.verifyCode({
      email: pendingEmail,
      code,
    });

    if (!data.User.verifyEmail) {
      throw new Error("El código no es válido.");
    }

    // El backend vuelve a exigir el código al definir la contraseña
    setPendingCode(code);
  };

  const setPassword = async (password: string) => {
    if (!pendingEmail || !pendingCode) {
      throw new Error("Verifica tu correo antes de cambiar la contraseña.");
    }

    await AuthService.setPassword({
      email: pendingEmail,
      password,
      code: pendingCode,
    });

    setPendingEmail(null);
    setPendingCode(null);

    // Si había sesión (passwordRequired) se refresca; si no, vuelve al login
    if (TokenStorage.getAccessToken()) {
      await refreshUser();
      return;
    }

    setStatus("unauthenticated");
  };

  // Revoca la sesión en el servidor, no solo en el dispositivo
  const logout = async () => {
    await revokeSession();
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        pendingEmail,
        login,
        register,
        verifyEmail,
        resendCode,
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
