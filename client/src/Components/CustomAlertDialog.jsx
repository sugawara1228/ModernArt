import React from 'react';
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

function CustomAlertDialog() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={leastDestructiveRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            ユーザーを招待
          </AlertDialogHeader>
          <AlertDialogBody>
            このリンクを送信して、プレイヤーを招待できます。<br />
            <Input value={value} isReadOnly w='80%' text='center' />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={leastDestructiveRef} onClick={onClose}>
              閉じる
            </Button>
            <Button colorScheme='yellow' onClick={onCopy} ml={3}>
              {hasCopied ? 'コピーしました!' : 'Copy'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default CustomAlertDialog;