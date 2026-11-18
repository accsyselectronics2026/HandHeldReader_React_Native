import { useState } from 'react';
import { ButtonGroup,Button,ButtonText,Icon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,Heading,Text,SlashIcon,CheckCircleIcon, HStack} from "@gluestack-ui/themed"


function AlertComponent({showAlertDialog,status,message, onclose}) {

  const[isOpen,setisOpen] = useState(showAlertDialog);

  return (
    <AlertDialog
                isOpen={isOpen}
                onClose={() => {
                  setisOpen(false)
                }}
            >
        <AlertDialogBackdrop  />
        <AlertDialogContent>
          <AlertDialogHeader>
          <HStack >
            {status == 'Error' && <Icon as={SlashIcon} m="$2" w="$7" h="$7" fill="$red700" />}
            {status !== 'Error' && <Icon as={CheckCircleIcon} m="$2" w="$7" h="$7" fill="$success400"  />}
            
            
            <Heading size="2xl" >{status}</Heading>
          </HStack>
           
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="lg">
              {message}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setisOpen(false);
                  onclose()
                }}
              >
                <ButtonText>Ok</ButtonText>
              </Button>
           
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    );

}


export default AlertComponent; 

