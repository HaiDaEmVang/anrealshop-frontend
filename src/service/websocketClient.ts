// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// const connectWebSocket = (userId: string, onMessage: (msg: any) => void) => {
//   const socket = new SockJS("http://localhost:8080/ws", null, {
//     withCredentials: true, 
//   });

//   const client = new Client({
//     webSocketFactory: () => socket as any,
//     onConnect: () => {
//       client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
//         onMessage(JSON.parse(message.body));
//       });
//     },
//   });

//   client.activate();
//   return client;
// };

// export default connectWebSocket;
