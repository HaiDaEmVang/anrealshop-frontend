// 'src/ws.ts'
import SockJS from 'sockjs-client';
import { Client, type IMessage } from '@stomp/stompjs';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4141';
const WS_URL = `${API_BASE}/api/ws_drew`;

let stompClient: Client | null = null;

function ensureClient(): Client {
  if (stompClient) return stompClient;
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(
        WS_URL,
        undefined,
        { transports: ['websocket', 'xhr-streaming', 'xhr-polling'], withCredentials: true } as any
      ),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: (m) => console.log('[STOMP]', m),
  });

  stompClient.onConnect = () => {
    stompClient!.subscribe('/user/queue/notifications', (msg: IMessage) => {
      console.log('Notification:', msg.body);
    });

    stompClient!.subscribe('/topic/system', (response) => {
                    console.log('Received message:', response.body);
                });

  
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker error:', frame.headers['message'], frame.body);
  };

  stompClient.onWebSocketError = (event) => {
    console.error('WS error:', event);
  };

  return stompClient;
}

export function connectWs(): void {
  if (stompClient?.active) {
    console.log('[WS] Already active, skip connect');
    return;
  }

  // Nếu stompClient tồn tại nhưng không active, reset nó
  if (stompClient && !stompClient.active) {
    stompClient = null;
  }

  const client = ensureClient();
  client.activate();
}

export function disconnectWs(): void {
  if (stompClient?.active) {
    stompClient.deactivate();
    stompClient = null;
  }
}


export function sendMessage(destination: string, body: any) {
  if (!stompClient || !stompClient.active) {
    console.warn('[WS] Client not connected!');
    return;
  }

  stompClient.publish({
    destination: '/app_message' + destination, 
    body: JSON.stringify(body),
  });
  console.log('[WS] Message sent to', destination);
}