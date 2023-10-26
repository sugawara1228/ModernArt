const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ルームを管理するためのオブジェクト
const rooms = new Map();

// ユーザー情報を管理するためのオブジェクト
const users = new Map();

// クライアントからの接続イベントをリッスン
io.on("connection", (socket) => {
  console.log(`${socket.id}クライアントが接続しました`);

  // ルーム作成
  socket.on("createRoom", (roomId, userName) => {
    console.log(`roomid=>"${roomId}",userName"${userName}"`);
    //   rooms.set(roomId, new Set());
    socket.join(roomId);
    //   rooms.get(roomId).add(socket.id);
    //   users.set(socket.id, { name: userName, room: roomId });
    socket.emit("roomCreated", roomId, userName);
    console.log(`socket.id:${socket.id}ユーザー "${userName}" がルーム "${roomId}" を作成しました`);
  });

//   // ルームへの入室
//   socket.on("joinRoom", (roomId, userName) => {
//     if (rooms.has(roomId)) {
//       socket.join(roomId);
//       rooms.get(roomId).add(socket.id);
//       users.set(socket.id, { name: userName, room: roomId });
//       socket.emit("roomJoined", roomId, userName);
//       console.log(`ユーザー "${userName}" がルーム "${roomId}" に入室しました`);
//     } else {
//       socket.emit("roomNotFound", roomId);
//     }
//   });

  // クライアントからのメッセージをルーム内のクライアントにブロードキャスト
  socket.on("sendMessage", (roomId, userName, message) => {
    // const user = users.get(socket.id);
    console.log(`socket.id:${socket.id}roomID${roomId}に入室している${userName}がメッセージを送信しました。${message}`);
    io.to(roomId).emit("messageReceived", userName, message);
  });

  // クライアントからの切断イベントをリッスン
  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      rooms.get(user.room).delete(socket.id);
      users.delete(socket.id);
      socket.leave(user.room);
      console.log(
        `ユーザー "${user.name}" がルーム "${user.room}" から退出しました`
      );
    }
  });
});

server.listen(3001, () => {
  console.log("サーバーがポート3001で実行中");
});
