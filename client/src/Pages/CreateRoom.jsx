import React, { useState } from 'react';
import {
  Flex,
  Button,
  Heading,
  Text,
  Center,
  Input,
  Box,
} from '@chakra-ui/react';
import Gbox from '../Components/GlassBox';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useRecoilState } from 'recoil';
import { userDataState } from '../state/userDataState';

const socket = io('http://localhost:3001');

function CreateRoom() {
  const [userData, setUserData] = useRecoilState(userDataState);
  const navigate = useNavigate();

  const createRoom = () => {
    // ランダムなルームIDを生成
    const roomId = randomRoomIdCreate();
    // ルーム作成API呼び出し
    socket.emit('createRoom', roomId, userData);

    // メイン画面に移動
    navigate('/Main');
  };

  const randomRoomIdCreate = () => {
    return (
      new Date().getTime().toString(16) + Math.floor(Math.random()).toString(16)
    );
  };

  return (
    <Flex
      height="100vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Gbox>
        <Text as="b">名前を入力して、ルームを作成してください</Text>
        <Input
          onChange={e => setUserData(e.target.value)}
          placeholder="ニックネーム"
          w="22rem"
          mt="5"
          mb="35"
        />
        <Button
          onClick={createRoom}
          colorScheme="yellow"
          w="22rem"
          size="lg"
          border="none"
        >
          ルームを作成
        </Button>
      </Gbox>
    </Flex>
  );
}

export default CreateRoom;
