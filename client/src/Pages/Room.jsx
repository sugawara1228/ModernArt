import React, { useState, useEffect, useContext,useRef } from 'react';
import {
  Flex,
  Button,
  Heading,
  Text,
  Center,
  Input,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  useClipboard,
} from '@chakra-ui/react';
import Gbox from '../Components/GlassBox';
import { useRecoilState } from 'recoil';
import { userDataState } from '../state/userDataState';
import { SocketContext } from '../index';

function Room() {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [joinedUsers, setJoinedUsers] = useState(0);
  const [joinFlg, setJoinFlg] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  
  const addPath = window.location.href;
  

    useEffect(() => {
        // サーバーからのメッセージ受信通知
        socket.on('messageReceived', (sendName, message) => {
            setMessageList((prevMessageList) => [...prevMessageList, sendName + ': ' + message]);
        });

        // サーバーからのルーム入室通知
        socket.on('roomJoined', (rooms, users) => {
            setRoomId(users.roomId);
            setUserName(users.name);
            setMessageList((prevMessageList) => [...prevMessageList, users.name + 'が入室しました。']);
            setJoinedUsers(rooms.users.length);
            setJoinFlg(true);
        });

        // サーバーからのルーム退出通知
        socket.on('leaveRoom', (rooms, users) => {
            setMessageList((prevMessageList) => [...prevMessageList, users.name + 'が退出しました。']);
            setJoinedUsers(rooms.users.length);
        });

        setValue(addPath);
        
    },[]);
    
    const sendMessage = () => {
        socket.emit('sendMessage', message);
    };

    const joinRoom = () => {
        // 現在いるパスからroomIdを取り出してroomに入室する
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/');
        const roomId = pathSegments[pathSegments.length - 1];

        socket.emit('joinRoom', roomId, userName);
    }

    return (
        <>
        { joinFlg ? (
        
        <Box>
            <Flex height="10%" justifyContent="start" alignItems="center" p="10">
                <Button onClick={onOpen} colorScheme='yellow' borderRadiu="30px" w="12rem"
                size="lg">
                    招待
                    <span class="material-symbols-outlined">
                        person
                    </span>
                    {joinedUsers}
                </Button>
            </Flex>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    ユーザーを招待
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        このリンクを送信して、プレイヤーを招待できます。<br />
                        <Input 
                        value={value}
                        isReadOnly 
                        w="80%" 
                        text="center"
                        />
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        閉じる
                    </Button>
                    <Button colorScheme='yellow' onClick={onCopy} ml={3}>
                        {hasCopied ? "コピーしました!" : "Copy"}
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Flex height="80vh" justifyContent="end" alignItems="center" py="50" px="10">
                <Gbox w="20%" h="100%" justifyContent="flex-start">
                    <Text>ルームID:{roomId}</Text>
                    <Text>
                        {messageList.map((messageContent, index) => {
                            return <Text key={index}> {messageContent}</Text>;
                        })}
                    </Text>
                    <Box position="absolute" bottom="10" w="100%">
                        <Box position="relative">
                            <Input
                            onChange={e => setMessage(e.target.value)}
                            w="75%"
                            mt="5"
                            mb="35"
                            border="none"
                            bg="rgba(255, 255, 255, 0.2)"
                            z-index="100"
                            />
                            <Button
                            onClick={sendMessage}
                            position="absolute"
                            right="10%"
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
        </Box>
        ) : (
        <Flex
        height="100vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        >
            <Gbox>
                <Text as="b">名前を入力して、ルームに入室してください</Text>
                <Input
                onChange={e => setUserName(e.target.value)}
                placeholder="ニックネーム"
                w="22rem"
                mt="5"
                mb="35"
                />
                <Button
                onClick={joinRoom}
                colorScheme="yellow"
                w="22rem"
                size="lg"
                border="none"
                >
                ルームに入室
                </Button>
            </Gbox>
        </Flex>
        )}
        </>
    );
}

export default Room;
