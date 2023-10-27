import React, { useState, useEffect, useContext } from 'react';
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
import { useRecoilState } from 'recoil';
import { userDataState } from '../state/userDataState';
import { SocketContext } from '../index';

function Main() {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [messageList, setMessageList] = useState([]);
  

    useEffect(() => {
        socket.on('messageReceived', (sendName, message) => {
            console.log('メッセージ受信');
            setMessageList((prevMessageList) => [...prevMessageList, sendName + ': ' + message]);
        });

        socket.on('roomCreated', (roomId, userName) => {
            setRoomId(roomId);
            setUserName(userName);
            setMessageList((prevMessageList) => [...prevMessageList, userName + 'が入室しました']);
        });
        
    },[]);
    
    const sendMessage = () => {
        socket.emit('sendMessage', roomId, userName, message);
    };

    return (
        <Flex height="100vh" justifyContent="end" alignItems="center" px="50">
        <Gbox w="400px" h="800px" justifyContent="flex-start">
            <Text>ルームID:{roomId}</Text>
            <Text>
                {messageList.map((messageContent, index) => {
                    return <Text key={index}> {messageContent}</Text>;
                })}
            </Text>
            <Box position="absolute" bottom="10">
                <Box position="relative">
                    <Input
                    onChange={e => setMessage(e.target.value)}
                    w="18em"
                    mt="5"
                    mb="35"
                    border="none"
                    bg="rgba(255, 255, 255, 0.2)"
                    z-index="100"
                    />
                    <Button
                    onClick={sendMessage}
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
