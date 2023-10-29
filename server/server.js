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
let rooms = [];
// userオブジェクトを格納する配列
let users = [];

// クライアントからの接続イベントをリッスン
io.on("connection", (socket) => {
  console.log(`クライアントが接続しました。socket.id:"${socket.id}"`);

  /** ルーム作成処理 */
  socket.on("createRoom", (roomId, userName) => {

    // 以前のルーム作成・入室したときのデータを探す
    const oldUserData = users.find(user => user.userId === socket.id);

    // もし前のデータがあった場合、先にデータ削除＆ルーム退出処理を行う
    if(oldUserData) {
      console.log(`socket.id: "${socket.id}のユーザーの以前のデータが残っています。`);
      console.log('以前のデータの削除、退出処理を実行します');
      leaveRoom(socket);
    }

    // ユーザー情報
    const user = {
      userId: socket.id,
      roomId: roomId,
      name: userName
    }
    users.push(user);

    // ルーム情報
    rooms[roomId] = {
      users: [socket.id],
      turnIndex: 0
    };

    // ルームを作成
    socket.join(roomId);

    // クライアントにルーム作成完了を通知
    socket.emit("roomJoined", rooms[roomId], user);
    console.log(`socket.id:"${socket.id}"のユーザー "${userName}" がルーム "${roomId}" を作成しました`);
  });

  /** ルーム入室処理 */
  socket.on("joinRoom", (roomId, userName) => {

    // 以前作成・入室したルームが残っている場合は先に削除する
    const oldUserData = users.find(user => user.userId === socket.id);
    if(oldUserData) {
      console.log(`socket.id: "${socket.id}のユーザーの以前のデータが残っています。`);
      console.log('以前のデータの削除、退出処理を実行します');
      leaveRoom(socket);
    }

    // ユーザー情報追加
    const user = {
      userId: socket.id,
      roomId: roomId,
      name: userName
    }
    users.push(user);

    // ルーム情報追加
    if(rooms[roomId]) {
      rooms[roomId].users.push(socket.id);
    };

    //ルームに入室
    socket.join(roomId);

    // クライアントにルーム作成完了を通知
    io.to(roomId).emit("roomJoined", rooms[roomId], user);
    console.log(`socket.id:"${socket.id}"のユーザー "${userName}" がルーム "${roomId}" に入室しました`);
  });

  /** メッセージを受信し、ルーム内の全員に送信する */
  socket.on("sendMessage", (message) => {

    // メッセージの送信元のsocket.idから、ユーザー情報を取得
    const user = users.find(user => user.userId === socket.id);

    // ユーザ情報から、今いるルームidと名前を取得
    const roomId = user.roomId;
    const userName = user.name;

    // ルーム内の全員に送信
    io.to(roomId).emit("messageReceived", userName, message);
    console.log(`roomID${roomId}に入室している${userName}がメッセージを送信しました。${message}`);
  });

  /** クライアントからの退出イベントをリッスン */
  socket.on("leaveRoom", () => {
    console.log(`socket.id:"${socket.id}"が退出ボタンを押下しました。`);
    console.log('退出処理を実行します');
    leaveRoom(socket);
  });

  /** クライアントからの切断イベントをリッスン */
  socket.on("disconnect", () => {
    console.log(`socket.id:"${socket.id}"の接続が切れました。`);
    console.log('退出処理を実行します');
    leaveRoom(socket);
  });
});


/** 
 * ルーム退出処理  
 * socket.idを受け取り、該当ユーザを退出させデータから削除する
 */
function leaveRoom(socket) {
  const user = users.find(user => user.userId === socket.id);
  if (user) {
    rooms[user.roomId].users = rooms[user.roomId].users.filter(user => user !== socket.id);
    users = users.filter(user => user.userId !== socket.id);

    io.to(user.roomId).emit("leaveRoom", rooms[user.roomId], user);

    socket.leave(user.roomId);
    console.log(`ユーザー "${user.name}" がルーム "${user.roomId}" から退出しました`);
  }
}

server.listen(3001, () => {
  console.log("サーバーがポート3001で実行中");
});
