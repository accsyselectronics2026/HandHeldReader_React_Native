import {
  TextInput,
  Text,
  Dimensions,
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  BackHandler,
  ToastAndroid,
} from 'react-native';
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
  HStack,
  Divider,
  ButtonGroup,
} from '@gluestack-ui/themed';
import {useState, useContext, useEffect, useRef} from 'react';
import {AuthContext} from './store/auth-context';
import {getTruckNo, sendTruckRegisttration} from './util/auth';
import DeviceInfo from 'react-native-device-info';

import AlertComponent from './components/ui/AlertComponent';

const {ReaderModule} = NativeModules;

function RfidPage({navigation}) {
  const [TagNo, setTagNo] = useState('');
  const [TruckNo, setTruckNo] = useState('');
  const [isReading, setisReading] = useState(false);

  const [collectedTags, setCollectedTags] = useState([]);
  const [isCollecting, setIsCollecting] = useState(false);

  const authCtx = useContext(AuthContext);
  const [showAlert, setshowAlert] = useState(false);
  const [alertMessage, setalertMessage] = useState('');
  const [alertStatus, setalertStatus] = useState('');

  const inputRef = useRef(null);

  const [serialNumber, setSerialNumber] = useState('');

  useEffect(() => {
    const fetchSerialNumber = async () => {
      try {
        const serial = await DeviceInfo.getUniqueId();
        setSerialNumber(serial);
        console.log(serial);
      } catch (error) {
        console.error('Error getting serial number:', error);
      }
    };

    fetchSerialNumber();
  }, []);

  // Function to set focus on the input
  const focusInput = () => {
    inputRef.current.focus();
  };

  handleBackButton = () => {
    ToastAndroid.show('Back button is pressed!', ToastAndroid.SHORT);
    return true;
  };

  useEffect(() => {
    let subscription;

    if (isCollecting) {
      // Start listening for tags
      subscription = DeviceEventEmitter.addListener('DataFromNative', data => {
        console.log(data);

        if (authCtx.currentPageName === 'Truck Register') {
          setTagNo(data);
          StopInventory();
          return;
        }

        setCollectedTags(prevTags => {
          if (!prevTags.includes(data)) {
            setTagNo(data);
            return [...prevTags, data];
          }
          return prevTags;
        });
      });
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [isCollecting]);

  function StartInventory() {
    console.log('Inventory Started!!!');
    authCtx.isTruckFound = false;
    authCtx.TagArray = [];
    setCollectedTags([]);
    setisReading(true);
    setIsCollecting(true);
    ReaderModule.StartInventory();
    if (authCtx.currentPageName !== 'Truck Register') {
      // Stop after 5 seconds and process
      setTruckNo('Tag Collection Going On');
      setTimeout(() => {
        setTruckNo('Tag Collection Completed');
        StopInventory();
        processCollectedTags();
      }, 2000);
    }
  }

  function StopInventory() {
    console.log('Inventory Stopped!!!');
    setisReading(false);
    setIsCollecting(false);
    try {
      ReaderModule.stopInventory();
    } catch (err) {
      console.warn('Error stopping inventory:', err);
    }
  }

  async function processCollectedTags() {
    if (collectedTags.length === 0) {
      setTruckNo('No tags found!');
      return;
    }

    console.log('Collected tags:', collectedTags);

    const payload = {
      TagId: collectedTags.join(','), // send as comma-separated or array
      plantID: authCtx.currentPlantCode,
      identifier: authCtx.currentPageName,
      MultiTag: 'yes',
    };

    try {
      const token = await getTruckNo(payload);

      if (token) {
        authCtx.isTruckFound = true;
        setTruckNo(token.truckno);
        setTagNo(token.RFID);
        setshowAlert(true);
        setalertMessage(token.Desc);
        setalertStatus(token.status);
      } else {
        setTruckNo('No matching trucks found!');
      }
    } catch (err) {
      console.error('Error fetching truck data:', err);
      setTruckNo('Error fetching truck data!');
    } finally {
      setisReading(false);
    }
  }
  async function getTrucData(message) {
    try {
      if (message !== 'NO TAG') {
        const payload = {
          TagId: message,
          plantID: authCtx.currentPlantCode,
          identifier: authCtx.currentPageName,
          MultiTag: 'no',
        };

        const token = await getTruckNo(payload);

        if (token) {
          StopInventory();
          authCtx.isTruckFound = true;
          setTruckNo(token.truckno);
          setTagNo(token.RFID);
          setshowAlert(true);
          setalertMessage(token.Desc);
          setalertStatus(token.status);
        } else if (!authCtx.isTruckFound) {
          setTruckNo('Truck Not Found!!!');
        }
      } else {
        setTruckNo('No Tag Found!!');
      }
    } catch (error) {
      console.error('Error in getTrucData:', error);
    } finally {
      setisReading(false);
      setIsProcessingTag(false); // release lock after processing
    }
  }

  async function handleSubmit() {
    if (TagNo != '' && TruckNo != '') {
      const postData = {};
      postData.tagID = TagNo;
      postData.TruckNo = TruckNo;
      postData.plantID = authCtx.currentPlantCode;
      postData.plant = authCtx.currentPlantshortCode;
      postData.identifier = authCtx.currentPageName;
      const token = await sendTruckRegisttration(postData);
      setshowAlert(true);
      setalertMessage(token.Desc);
      setalertStatus(token.status);
      setTruckNo('');
      setTagNo('');
    } else {
      setshowAlert(true);
      setalertMessage('Please enter RFID and Truck No to proceed!!!');
      setalertStatus('Failure');
    }
  }

  function clearTag() {
    setshowAlert(false);
    setTruckNo('');
    setTagNo('');
    authCtx.isTruckFound = false;
    authCtx.TagArray = [];
  }

  function acknowledgeResponse() {
    setshowAlert(false);
    if (authCtx.currentPageName !== 'Truck Register') {
      setTruckNo('');
      setTagNo('');
    }
    authCtx.isTruckFound = false;
  }

  function HandleKeyPress(enterValue) {
    setTruckNo(enterValue);
  }

  return (
    <VStack>
      <Center>
        <Box w={Dimensions.get('window').width} p="$6">
          <FormControl
            p="$4"
            width={'$100'}
            borderWidth="$1"
            borderRadius="$lg"
            borderColor="$borderLight100"
            sx={{
              _dark: {
                borderWidth: '$1',
                borderRadius: '$lg',
                borderColor: '$borderDark800',
              },
            }}>
            <Center>
              <Heading color="#051937" size="xl" bold={true}>
                {authCtx.currentPageName}
              </Heading>
            </Center>
            <VStack space="xs">
              <Text color="$text900" lineHeight="$xs">
                RFID
              </Text>
              <Input ref={this.inputRef}>
                <InputField type="text" textAlign="center" value={TagNo} />
              </Input>

              <HStack space="xs">
                <Button w={'$1/3'} onPress={clearTag} action="negative">
                  <ButtonText color="$white">Clear</ButtonText>
                </Button>

                {/* <Button  w={"$1/2.5"} onPress={getTag} action="primary"  focusable={true} isFocused={true}>
                                    {isReading && <ButtonSpinner /> }
                                    {!isReading && <ButtonText color="$white" >Get</ButtonText> }
                                    
                                </Button> */}

                <Button
                  w={'$1/3'}
                  onPress={StartInventory}
                  action="primary"
                  focusable={true}
                  isFocused={true}>
                  {isReading && <ButtonSpinner />}
                  {!isReading && <ButtonText color="$white">Start</ButtonText>}
                </Button>

                <Button
                  w={'$1/3'}
                  onPress={StopInventory}
                  action="primary"
                  focusable={true}
                  isFocused={true}>
                  <ButtonText color="$white">Stop</ButtonText>
                </Button>
              </HStack>

              <Text color="$text900" lineHeight="$xs">
                Truck No
              </Text>
              <Input>
                <InputField
                  type="text"
                  value={TruckNo}
                  onChangeText={HandleKeyPress}
                />
              </Input>
            </VStack>

            <Divider my="$4" />

            {(authCtx.isTruckFound ||
              authCtx.currentPageName == 'Truck Register') && (
              <Button onPress={handleSubmit} action="positive">
                <ButtonText color="$white">Submit</ButtonText>
              </Button>
            )}

            <Divider my="$4" />

            <Button
              action="secondary"
              onPress={() => {
                navigation.goBack();
              }}>
              <ButtonText color="$white">Go Back</ButtonText>
            </Button>
          </FormControl>
        </Box>
      </Center>
      {showAlert && (
        <AlertComponent
          showAlertDialog={true}
          message={alertMessage}
          status={alertStatus}
          onclose={acknowledgeResponse}
        />
      )}
    </VStack>
  );
}

export default RfidPage;
