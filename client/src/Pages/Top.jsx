import React from 'react';
import { Flex, Button, Heading, Text, Center, } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Top() {
  return (
<Flex
   height="100vh" // 画面の高さいっぱいにする
   justifyContent="center" // 水平中央に配置
   alignItems="center" // 垂直中央に配置
   flexDirection="column" // 子要素を縦に配置
>
   <Heading as="h1" size="3xl" mb="10">
     ModernArt<br />
     <Center>
      <Text fontSize="3xl" color="blue.900">ONLINE</Text>
     </Center>
   </Heading>
   <Link to="/CreateRoom">
      <Button w="22rem" colorScheme="yellow" size="lg">ルームの作成</Button>
   </Link>
   
 </Flex>
  );
}

export default Top;
