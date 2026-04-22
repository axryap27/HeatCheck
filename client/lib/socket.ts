import { io, Socket } from "socket.io-client";
import type {
  HeatUpdateEvent,
  NewMessageEvent,
} from "@/types";

// Typed event map for the socket client
interface ServerToClientEvents {
  heat_update: (data: HeatUpdateEvent) => void;
  new_message: (data: NewMessageEvent) => void;
  room_joined: (data: { court_id: string; heat_level: string }) => void;
}

interface ClientToServerEvents {
  join_court: (data: { court_id: string }) => void;
  leave_court: (data: { court_id: string }) => void;
  send_chat: (data: {
    court_id: string;
    session_id: string;
    display_name: string;
    content: string;
  }) => void;
}

type HeatCheckSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let _socket: HeatCheckSocket | null = null;

export function getSocket(): HeatCheckSocket {
  if (!_socket) {
    _socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:8000",
      {
        autoConnect: false,
        transports: ["websocket"],
      }
    ) as HeatCheckSocket;
  }
  return _socket;
}

export function connectSocket(): void {
  getSocket().connect();
}

export function disconnectSocket(): void {
  if (_socket?.connected) {
    _socket.disconnect();
  }
}
