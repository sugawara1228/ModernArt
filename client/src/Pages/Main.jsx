import React, { useState, useEffect } from 'react';
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
import io from 'socket.io-client';
import { useRecoilState } from 'recoil';
import { userDataState } from '../state/userDataState';

function Main() {
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useRecoilState(userDataState);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('roomCreated', (roomId, userName) => {
      setRoomId(roomId);
      setUserData(userName);
    });
  }, []);

  return (
    <Flex height="100vh" justifyContent="end" alignItems="center" px="50">
      <Gbox w="400px" h="800px" justifyContent="flex-start">
        <Text>{roomId}</Text>
        <Text>{userData}</Text>
        <Box position="absolute" bottom="10">
          <Box position="relative">
            <Input
              onChange={e => setInputValue(e.target.value)}
              w="18em"
              mt="5"
              mb="35"
              border="none"
              bg="rgba(255, 255, 255, 0.2)"
              z-index="100"
            />
            <Button
              position="absolute"
              right="0"
              top="38%"
              transform="translateY(-38%)"
              bg="none"
              _hover={{ bg: 'none' }}
            >
              <span class="material-symbols-outlined green">send</span>
            </Button>
          </Box>
        </Box>
      </Gbox>
    </Flex>
  );
}

export default Main;
