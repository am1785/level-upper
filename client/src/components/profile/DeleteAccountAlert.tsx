import { useState, useRef } from "react";
import { useToast, Text, Input, IconButton, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Spacer, useDisclosure, VStack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDeleteUserMutation } from "../../hooks/useUsersMutation";

type DeleteAccountAlertProps = {
    _id: string
}

const DeleteAccountAlert:React.FC<DeleteAccountAlertProps> = ({_id}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const {data, mutate, status } = useDeleteUserMutation();
    const [confirmation, setConfirmation] = useState<string>("");
    // mutate({_id: _id})
    const toast = useToast();

    const handleDeleteAccount = () => {
        confirmation === "DELETE" ?
        mutate({_id: _id}) : toast({
            title: 'warning',
            description: "bad keyword",
            status: 'warning',
            duration: 2000,
            isClosable: true,
          })

    }

    return (<>
        <IconButton mt={2} w="200px" h={'1.75em'} left={'60px'} colorScheme="red" aria-label="delete account button" icon={<DeleteIcon />} onClick={onOpen} />

        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size={'sm'}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>Are you sure? All data associated with this account will be erased. <strong>You can't undo this action afterwards.</strong></Text>
              <Text mt={"1em"}>Type DELETE below to confirm</Text>
              <Input mt={1} size={'lg'} onChange={(e) => setConfirmation(e.currentTarget.value)}/>
            </AlertDialogBody>

            <AlertDialogFooter>
                <Flex direction={'row'} w={'100%'}>
                    <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                    </Button>
                    <Spacer />
                    <Button colorScheme='red' onClick={() => {handleDeleteAccount(); onClose();}}>
                    Delete
                    </Button>
                </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>)
}

export default DeleteAccountAlert;