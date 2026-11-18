
import { Text,Dimensions,DeviceEventEmitter,NativeModules} from "react-native";
import { Button,ButtonText,ButtonSpinner,ButtonIcon,
  Box,VStack,Center,Heading,FormControl,Input,InputField, HStack,Divider,ButtonGroup,
  } from "@gluestack-ui/themed"
import { useState,useContext,useEffect } from "react";
import  { AuthContext } from "./store/auth-context";
import {getTruckNo,sendPlmsService} from "./util/auth";

import AlertComponent from "./components/ui/AlertComponent"


const {ReaderModule} = NativeModules;
// const {ScanKeyModule} = NativeModules;

function RfidPage({ navigation }){
    const [TagNo,setTagNo] = useState('');
    const [TagArray,setTagArray] = useState([]);
    const [TruckNo,setTruckNo] = useState('');
    const [isReading,setisReading] = useState(false);
    const [isTruckFound,setisTruckFound] = useState(false);
    const authCtx = useContext(AuthContext);
    const [showAlert, setshowAlert] = useState(false);
    const [alertMessage, setalertMessage] = useState('');
    const [alertStatus, setalertStatus] = useState('');

    // const type = 3;
    // const scanKeyArray= [1,2,3];
    //  ReaderModule.setScanKey(type, scanKeyArray);
 
   


    // useEffect(() => {
    //     // Add event listener when the component mounts
    //     const scanKeyListener = DeviceEventEmitter.addListener(
    //       'onScanKeyPressed',
    //       () => {
    //         // Handle scan button press event here
    //         console.log('Scan button pressed!');
    //         // Your logic for handling scan button press
    //       }
    //     );
    
    //     // Remove event listener when the component unmounts
    //     // return () => {
    //     //   scanKeyListener.remove();
    //     // };
    //   }, []);





async function getTag() {
    try {
        setTruckNo("");
        setTagNo("");
        setisTruckFound(false);
        message ="";
        setTagArray([]);
        setisReading(true);
        const token = await ReaderModule.getversion('RFID', message => {
            // setTagArray(prevTagArray => [...prevTagArray, message]);
            if (authCtx.currentPageName == 'Truck Register') {
                if(message.indexOf('3410') >= 0){
                    setTagNo(message);
                    return;
                }
            }
            setTagNo(message);
            setTruckNo('Getting Truck No...... ');
            const result =  getTrucData(message);
        });
      

    } catch (error) {
      setisReading(false);
    }
  }

  async function getTrucData(message){
    if (message !== "NO TAG"){
        const token = await getTruckNo(authCtx.currentPlantCode, message);
        console.log(message);
        console.log(token);
        if (token){
            setTruckNo(token.VEHICLE_NO);
            setTagNo(token.RFID);
            setisTruckFound(true);
        }else{
            setTruckNo('Truck Not Found!!!');
        }
    }else{
        setTruckNo('No Tag Found!!');
    }
   
    setisReading(false);
  }


  async function handleSubmit(){

    const postData = {};
    postData.rfidTag= TagNo;
    postData.truckNo= TruckNo;
    postData.Type = authCtx.currentPageName;
    postData.plantCode = authCtx.currentPlantCode;
    // console.log(postData);
    const token = await sendPlmsService(postData);

    setshowAlert(true);
    setalertMessage(token.Body);
    setalertStatus(token.Status);

    console.log(token);

  }

  function clearTag(){
    setshowAlert(false);
    setTruckNo("");
    setTagNo("");
    setisTruckFound(false);
    setTagArray([]);
  }
  

  function acknowledgeResponse(){
    setshowAlert(false);
    if (authCtx.currentPageName !== 'Truck Register'){
        setTruckNo("");
        setTagNo("");
    }
 
    setisTruckFound(false);
  }
 
    return(
        
        <VStack >
            <Center>
                <Box w={Dimensions.get('window').width} p="$6" >
                    <FormControl
                        p="$4"
                        width={"$100"}
                        borderWidth="$1"
                        borderRadius="$lg"
                        borderColor="$borderLight100"
                        sx={{
                        _dark: {
                            borderWidth: "$1",
                            borderRadius: "$lg",
                            borderColor: "$borderDark800",
                        },
                        }}>
                        <Center>
                            <Heading color="#051937" size ="xl" bold={true}>{authCtx.currentPageName}</Heading>
                        </Center>
                        <VStack space="xs">
                            <Text color="$text900" lineHeight="$xs">RFID</Text>
                            <Input>
                                <InputField type="text" textAlign="center" value={TagNo} />
                            </Input>



                            <HStack space="xs">
                                <Button  w={"$1/2"} onPress={clearTag}action="negative" >
                             
                                  <ButtonText color="$white" >Clear Tag</ButtonText> 
                                    
                                </Button>

                                <Button  w={"$1/2"} onPress={getTag} action="primary"  focusable={true} isFocused={true}>
                                    {isReading && <ButtonSpinner /> }
                                    {!isReading && <ButtonText color="$white" >Get Tag</ButtonText> }
                                    
                                </Button>
                            </HStack>

                            <Text color="$text900" lineHeight="$xs" >Truck No</Text>
                            <Input isDisabled={true}>
                                <InputField type="text"  value={TruckNo} />
                            </Input>
                            
                        </VStack>

                        <Divider my="$4" />

                            {(isTruckFound || authCtx.currentPageName == 'Truck Register') &&
                                <Button onPress={handleSubmit} action="positive">
                                    <ButtonText color="$white">Submit</ButtonText>
                                </Button>
                            }

                        <Divider my="$4" />


                        <Button action="secondary"  onPress={() => {
                                            navigation.goBack();
                                        }}>
                            <ButtonText color="$white">Go Back</ButtonText>
                        </Button>

                    </FormControl>
                </Box>
            </Center>
            {showAlert &&
        <AlertComponent showAlertDialog={true} message={alertMessage}  status={alertStatus} onclose={acknowledgeResponse}/>}
            
          </VStack>

          

          
    );

}

export default RfidPage;