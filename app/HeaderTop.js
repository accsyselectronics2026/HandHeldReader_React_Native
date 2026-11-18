import {
  Box,
  VStack,
  Heading,
  HStack,
  Link,
  LinkText,
  Text,
  Image,
  Pressable,
  Center,
  Divider,
} from '@gluestack-ui/themed';
import {AuthContext} from './store/auth-context';
import {useContext, useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {logoutandcleartoken} from './util/auth';
import AlertComponent from './components/ui/AlertComponent';

function HeaderTop({onPress}) {
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(false);

  const [showAlert, setshowAlert] = useState(false);
  const [alertMessage, setalertMessage] = useState('');
  const [alertStatus, setalertStatus] = useState('');

  const [logoutName, setlogoutName] = useState('Logout');
  const width = Dimensions.get('window').width;

  function acknowledgeResponse() {
    // console.log('FAlse');
    setlogoutName('Logout');
    setshowAlert(false);
  }

  async function onPress1() {
    setlogoutName('Logging Out...');
    // console.log('Logging out user:', authCtx.userName1);
    let result = await logoutandcleartoken(
      authCtx.currentPlantCode,
      authCtx.userName1,
    );
    // console.log('Logout result:', result);
    if (result.status == 'SUCCESS') {
      setIsLogin(false);
      onPress();
    } else {
      setshowAlert(true);
      setalertMessage(result.Desc);
      setalertStatus(result.status);
    }
  }

  useEffect(() => {
    if (authCtx.isAuthenticated) {
      setIsLogin(true);
    }
  }, []);

  console.log('PlantName -', authCtx.currentPlantName);

  return (
    <Center>
      <VStack space="md">
        <Center w={width}>
          <HStack>
            <Heading bold={true} italic={true} size="md" color="#0055a6">
              Dalmia Cement (Bharat) Limited{' '}
            </Heading>
            <Image
              size="2xs"
              resizeMode="contain"
              alt="DCBL"
              source={require('./assets/dcbl1.png')}
            />
          </HStack>

          <HStack>
            <Heading italic={true} size="xs" color="#0055a6">
              Version - 0.1.5.5{' '}
            </Heading>
          </HStack>
        </Center>

        {isLogin && (
          <VStack>
            <Center w={width}>
              <Center>
                <Text size="sm" bold={true}>
                  Plant Name: {authCtx.currentPlantName}
                </Text>
              </Center>

              <HStack space="md">
                <Box w={'$1/2'}>
                  <HStack>
                    <Text color="$amber900" italic={true} size="sm" bold={true}>
                      Welcome:
                    </Text>
                    <Text size="sm" bold={true}>
                      {' '}
                      {authCtx.userName1}
                    </Text>
                  </HStack>
                </Box>

                <Box w={'$1/3'}>
                  <HStack reversed={true}>
                    <Pressable onPress={onPress1}>
                      <Text
                        color="$cyan800"
                        size="md"
                        italic={true}
                        underline={true}>
                        {logoutName}
                      </Text>
                    </Pressable>
                  </HStack>
                </Box>
              </HStack>
            </Center>
          </VStack>
        )}
        {showAlert && (
          <AlertComponent
            showAlertDialog={true}
            message={alertMessage}
            status={alertStatus}
            onclose={acknowledgeResponse}
          />
        )}
      </VStack>
    </Center>
  );
}

export default HeaderTop;
