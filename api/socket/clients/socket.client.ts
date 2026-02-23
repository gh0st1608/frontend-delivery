import { io, Socket } from "socket.io-client";

interface CreateSocketOptions {
  role?: "courier" | "consumer";
  courierId?: string;
  orderId?: string;
}

export function createSocket(options: CreateSocketOptions = {}): Socket {
  const query: Record<string, string> = {};

  if (options.role) query.role = options.role;
  if (options.courierId) query.courierId = options.courierId;
  if (options.orderId) query.orderId = options.orderId;

  return io(process.env.EXPO_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
    autoConnect: false, // 👈 control explícito
    query,
  });
}
