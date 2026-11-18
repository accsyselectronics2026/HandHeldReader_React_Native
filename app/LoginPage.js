import {TextInput, View, StyleSheet, Text, FlatList} from 'react-native';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  Box,
  VStack,
  Center,
  Heading,
  FormControl,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Image,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Icon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  ChevronDownIcon,
  ScrollView,
  Spinner,
} from '@gluestack-ui/themed';
import {useState, useContext, useEffect} from 'react';
import {login, getPlantName} from './util/auth';
import {EyeIcon, EyeOffIcon} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from './store/auth-context';
import AlertComponent from './components/ui/AlertComponent';
import LoadingScreen from './LoadingScreen';

function LoginPage({navigation}) {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassowrd] = useState('');
  const [plantCode, setPlantCode] = useState('default');
  const [isPlantCode, setIsPlantCode] = useState(true);
  const [showPassword, setshowPassword] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [alertMessage, setalertMessage] = useState('');
  const [alertStatus, setalertStatus] = useState('');
  const [showSpinner, setshowSpinner] = useState(false);
  const [plantCodeList, setplantCodeList] = useState([]);

  const authCtx = useContext(AuthContext);

  // console.log('Login Rendering!!!!');

  function userNameHandler(enteredValue) {
    setUserName(enteredValue);
  }
  function userPasswordHandler(enteredValue) {
    setUserPassowrd(enteredValue);
  }

  function plantCodeHandler(enteredValue) {
    console.log(enteredValue);
    if (enteredValue == '') {
      setIsPlantCode(false);
    } else {
      setPlantCode(enteredValue);
      setIsPlantCode(true);
    }

    authCtx.currentPlantName = plantCodeList[enteredValue];
    authCtx.currentPlantCode = enteredValue;
    storeUserToken('rfidPlantCode', enteredValue);
    storeUserToken('rfidPlantName', plantCodeList[enteredValue]);
  }

  function showPasswordHandler() {
    if (showPassword) {
      setshowPassword(false);
    } else {
      setshowPassword(true);
    }
  }

  const storeUserToken = async (identifier, userToken) => {
    try {
      await AsyncStorage.setItem(identifier, userToken);
      // console.log('User token stored successfully!');
    } catch (error) {
      // console.error('Error storing user token:', error);
    }
  };

  // useEffect(() => {
  //   async function getUserToken(){
  //     try {
  //       const userToken = await AsyncStorage.getItem('rfidUserToken');
  //       if (userToken !== null) {
  //         console.log('User token retrieved:', userToken);

  //         authCtx.isAuthenticated = true;
  //         const userName = await AsyncStorage.getItem('rfidUserName');
  //         authCtx.userName1 = userName;

  //         const plantCode = await AsyncStorage.getItem('rfidPlantCode');
  //         authCtx.currentPlantCode = plantCode;

  //         const plantName = await AsyncStorage.getItem('rfidPlantName');
  //         authCtx.currentPlantName = plantName;
  //         setisLoading(false);
  //         navigation.navigate('Home');

  //         return userToken;
  //       } else {
  //         console.log('No user token found');
  //         setisLoading(false);
  //         return null;

  //       }
  //     } catch (error) {
  //       setisLoading(false);
  //       console.error('Error retrieving user token:', error);
  //       return null;
  //     }
  //   }
  //   getUserToken();
  // },[]);

  useEffect(() => {
    // async function GetPlantName(){
    //   const result = await getPlantName();
    //   setplantCodeList(result);
    // }
    // GetPlantName();
    var plantlist = [];
    plantlist['1320'] = 'RGP UNIT-1(1320)';
    plantlist['1324'] = 'RGP UNIT-2(1324)';
    plantlist['1321'] = 'KAPILAS UNIT-1(1321)';
    plantlist['1325'] = 'KAPILAS UNIT-2(1325)';
    plantlist['1360'] = 'CHANDRAPUR(1360)';
    plantlist['6300'] = 'JAGI ROAD (6300)';
    plantlist['1340'] = 'MEGHALAYA (1340)';
    plantlist['1302'] = 'ARIYALUR (1302)';
    plantlist['1322'] = 'BCW(MIDNAPUR)(1322)';
    plantlist['1300'] = 'BELGAUM(1300)';
    plantlist['1323'] = 'BOKARO UNIT-1(1323)';
    plantlist['1328'] = 'BOKARO UNIT-2(1328)';
    plantlist['1303'] = 'KADAPA(1303)';
    plantlist['1329'] = 'KALYANPUR(1329)';
    plantlist['1301'] = 'DALMIAPURAM(1301)';
    plantlist['3300'] = 'LANKA(3300) UNIT-1';
    plantlist['3307'] = 'LANKA(3307) UNIT-2';
    plantlist['3301'] = 'UMRANSHU(3301)';
    plantlist['4301'] = 'SATTUR(4301)';
    plantlist['1093'] = 'CHUNNAR(1093)';
    plantlist['0000'] = 'ACCSYS(0000)';
    setplantCodeList(plantlist);
  }, []);

  // console.log(setplantCodeList);

  async function loginHandler() {
    try {
      setshowSpinner(true);
      if (
        authCtx.currentPlantCode != '' &&
        userName != '' &&
        userPassword != ''
      ) {
        const result = await login(
          authCtx.currentPlantCode,
          userName,
          userPassword,
        );
        setUserName('');
        setPlantCode('');
        setIsPlantCode(false);
        setUserPassowrd('');
        console.log(result);
        if (result.status == 'SUCCESS') {
          console.log('Login Successful!!!');
          authCtx.userName1 = result.UserName;
          storeUserToken('rfidUserToken', result.loginToken);
          storeUserToken('rfidUserName', result.UserName);
          navigation.navigate('Home');
          authCtx.isAuthenticated = true;
          setUserName('');
          setUserPassowrd('');
        } else if (result.status == 'Error') {
          setshowAlert(true);
          setalertMessage(result.Desc);
          setalertStatus('Error');
        } else {
          setshowAlert(true);
          setalertMessage(result.status);
          setalertStatus('Error');
        }
      } else {
        setalertStatus('Error');
        setshowAlert(true);
        if (userName == '') {
          setalertMessage('User Name is empty!!!');
        } else if (userPassword == '') {
          setalertMessage('Password is empty!!!');
        }
      }
      setshowSpinner(false);
    } catch (error) {
      console.log(error);
      setshowAlert(true);
      setalertMessage(JSON.stringify(error));
      setalertStatus('Error');
      setshowSpinner(false);
    }
  }

  return (
    <View style={styles.container}>
      <Center>
        <VStack>
          <Box></Box>
          <Box w="$72">
            <FormControl
              p="$4"
              width={'$100'}
              borderWidth="$1"
              borderRadius="$lg"
              borderColor="$borderLight300"
              sx={{
                _dark: {
                  borderWidth: '$1',
                  borderRadius: '$lg',
                  borderColor: '$borderDark800',
                },
              }}>
              <VStack space="3xl">
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: '#0055a6',
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}>
                  RFID SCANNER
                </Text>
                <VStack space="4xl">
                  <Text color="$text500" lineHeight="$xs">
                    Select the Plant
                  </Text>
                  <Select onValueChange={plantCodeHandler} value={plantCode}>
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput placeholder="Select option" />
                      <SelectIcon mr="$3">
                        <Icon as={ChevronDownIcon} />
                      </SelectIcon>
                    </SelectTrigger>

                    <SelectPortal>
                      <SelectContent>
                        <ScrollView w="$80">
                          <SelectItem label="Select Option" />
                          {Object.keys(plantCodeList).map((key, index) => (
                            <SelectItem
                              key={index}
                              label={plantCodeList[key]}
                              value={key}
                            />
                          ))}
                        </ScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </VStack>

                <VStack space="xs">
                  {/* {isPlantCode  &&  */}
                  <Text color="$text500" lineHeight="$xs">
                    User Name
                  </Text>
                  {/* }
                   {isPlantCode &&   */}
                  <Input>
                    <InputField
                      type="text"
                      onChangeText={userNameHandler}
                      value={userName}
                    />
                  </Input>
                  {/* } */}
                </VStack>
                <VStack space="xs">
                  {/* {isPlantCode &&   */}
                  <Text color="$text500" lineHeight="$xs">
                    Password
                  </Text>
                  {/* }
                  {isPlantCode  &&   */}
                  <Input>
                    <InputField
                      type={showPassword ? 'text' : 'password'}
                      onChangeText={userPasswordHandler}
                      value={userPassword}
                    />
                    <InputSlot pr="$3">
                      {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                      <InputIcon
                        as={showPassword ? EyeIcon : EyeOffIcon}
                        color="$darkBlue500"
                        onPress={showPasswordHandler}
                      />
                    </InputSlot>
                  </Input>

                  {/* } */}
                </VStack>

                {/* {isPlantCode &&  */}
                <Button ml="auto" onPress={loginHandler}>
                  {showSpinner && <Spinner />}
                  {!showSpinner && (
                    <ButtonText color="$white">Log On</ButtonText>
                  )}
                </Button>
                {/* } */}
              </VStack>
            </FormControl>
          </Box>
        </VStack>
        {showAlert && (
          <AlertComponent
            showAlertDialog={true}
            message={alertMessage}
            status={alertStatus}
            onclose={() => setshowAlert(false)}
          />
        )}
      </Center>
    </View>
  );
}

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  row: {
    flexDirection: 'row', // Horizontal arrangement
  },
  image: {
    width: '20%',
    height: '30%',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 20,
    borderWidth: 0.3,
    borderRadius: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
