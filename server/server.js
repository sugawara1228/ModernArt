const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ルームを管理するためのオブジェクト
const rooms = new Map();

// ユーザー情報を管理するためのオブジェクト
const users = new Map();

// クライアントからの接続イベントをリッスン
io.on('connection', (socket) => {
  console.log('クライアントが接続しました');

  // ルーム作成
  socket.on('createRoom', (roomId, userName) => {
    console.log(`roomid=>"${roomId}",userName"${userName}"`);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
      socket.join(roomId);
      rooms.get(roomId).add(socket.id);
      users.set(socket.id, { name: userName, room: roomId });
      socket.emit('roomCreated', roomId, userName);
      console.log(`ユーザー "${userName}" がルーム "${roomId}" を作成しました`);
    } else {
      socket.emit('roomExists', roomId);
    }
  });

  // ルームへの入室
  socket.on('joinRoom', (roomId, userName) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      rooms.get(roomId).add(socket.id);
      users.set(socket.id, { name: userName, room: roomId });
      socket.emit('roomJoined', roomId, userName);
      console.log(`ユーザー "${userName}" がルーム "${roomId}" に入室しました`);
    } else {
      socket.emit('roomNotFound', roomId);
    }
  });

  // クライアントからのメッセージをルーム内のクライアントにブロードキャスト
  socket.on('sendMessage', (roomId, message) => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(roomId).broadcast.emit('messageReceived', user.name, message);
    }
  });

  // クライアントからの切断イベントをリッスン
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      rooms.get(user.room).delete(socket.id);
      users.delete(socket.id);
      socket.leave(user.room);
      console.log(`ユーザー "${user.name}" がルーム "${user.room}" から退出しました`);
    }
  });
});

server.listen(3000, () => {
  console.log('サーバーがポート3000で実行中');
});