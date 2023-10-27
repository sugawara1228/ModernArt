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

// roomオブジェクトを格納する配列
const rooms = [];
// userオブジェクトを格納する配列
const users = {};

// クライアントからの接続イベントをリッスン
io.on("connection", (socket) => {
  console.log(`${socket.id}クライアントが接続しました`);

  // ルーム作成
  socket.on("createRoom", (roomId, userName) => {
    users[socket.id] = {
      roomId: roomId,
      name: userName
    }
    // ルーム作成
    socket.join(roomId);
    // クライアントにルーム作成完了を通知
    socket.emit("roomJoined", roomId, userName);
    console.log(`socket.id:${socket.id}ユーザー "${userName}" がルーム "${roomId}" を作成しました`);
  });

  // ルームへの入室
  socket.on("joinRoom", (roomId, userName) => {
    users[socket.id] = {
      roomId: roomId,
      name: userName
    }
    //ルームに入室
    socket.join(roomId);
    // クライアントにルーム作成完了を通知
    io.to(roomId).emit("roomJoined", roomId, userName);
    console.log(`socket.id:${socket.id}ユーザー "${userName}" がルーム "${roomId}" に入室しました`);
  });

  // クライアントからのメッセージをルーム内にいる全員に送信
  socket.on("sendMessage", (message) => {
    roomId = users[socket.id].roomId;
    userName = users[socket.id].name;
    console.log(`roomID${roomId}に入室している${userName}がメッセージを送信しました。${message}`);
    io.to(roomId).emit("messageReceived", userName, message);
  });

  // クライアントからの切断イベントをリッスン
  // socket.on("disconnect", () => {
  //   const user = users.get(socket.id);
  //   if (user) {
  //     rooms.get(user.room).delete(socket.id);
  //     users.delete(socket.id);
  //     socket.leave(user.room);
  //     console.log(
  //       `ユーザー "${user.name}" がルーム "${user.room}" から退出しました`
  //     );
  //   }
  // });
});

server.listen(3001, () => {
  console.log("サーバーがポート3001で実行中");
});
