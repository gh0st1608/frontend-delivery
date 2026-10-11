// Permite que capas sin acceso a React (interceptores HTTP) avisen al
// AuthContext de que la sesión dejó de ser válida.
type Listener = () => void;

const listeners = new Set<Listener>();

export const SessionEvents = {
  onUnauthorized(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emitUnauthorized() {
    listeners.forEach((listener) => listener());
  },
};
