import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
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
import { useNavigate } from 'react-router-dom';

function Room() {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [joinedUsers, setJoinedUsers] = useState(0);
  const [joinFlg, setJoinFlg] = useState(false);
  const addModal = useDisclosure();
  const leaveModal = useDisclosure();
  const cancelRef = useRef();
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const navigate = useNavigate();
  const blockBrowserBack = useCallback(() => {
    window.history.go(1)
  }, [])
  
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

    /** ブラウザバックの禁止 */
    useEffect(() => {
        // 直前の履歴に現在のページを追加
        window.history.pushState(null, '', window.location.href)
    
        // 直前の履歴と現在のページのループ
        window.addEventListener('popstate', blockBrowserBack)
    
        // クリーンアップ
        return () => {
            window.removeEventListener('popstate', blockBrowserBack)
        }
    }, [blockBrowserBack])
    
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

    const leaveRoom = () => {
        socket.emit('leaveRoom');

        // top画面に移動
        navigate('/');
    }

    return (
        <>
        { joinFlg ? (
        
        <Box>
            <Flex height="10%" justify="space-between" align="center" p="10">
                <Button onClick={addModal.onOpen} colorScheme='yellow' borderRadiu="30px" w="12rem"
                size="lg">
                    招待
                    <span class="material-symbols-outlined">
                        person
                    </span>
                    {joinedUsers}
                </Button>
            
            <AlertDialog
                isOpen={addModal.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={addModal.onClose}
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
                    <Button ref={cancelRef} onClick={addModal.onClose}>
                        閉じる
                    </Button>
                    <Button colorScheme='yellow' onClick={onCopy} ml={3}>
                        {hasCopied ? "コピーしました!" : "Copy"}
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Button onClick={leaveModal.onOpen} colorScheme='yellow' borderRadiu="30px" w="10rem"
                size="lg">
                    ルーム退出
            </Button>
            <AlertDialog
                isOpen={leaveModal.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={leaveModal.onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    ルームの退出
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        ルームを退出しますか？
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={leaveModal.onClose}>
                        キャンセル
                    </Button>
                    <Button onClick={leaveRoom} colorScheme='red'  ml={3}>
                        退出
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            </Flex>
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
