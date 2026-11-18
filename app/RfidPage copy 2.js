
import { Text,Dimensions,DeviceEventEmitter,NativeEventEmitter,NativeModules,BackHandler,Keyboard} from "react-native";
import { Button,ButtonText,ButtonSpinner,ButtonIcon,
  Box,VStack,Center,Heading,FormControl,Input,InputField, HStack,Divider,ButtonGroup,
  } from "@gluestack-ui/themed"
import { useState,useContext,useEffect } from "react";
import  { AuthContext } from "./store/auth-context";
import {getTruckNo,sendPlmsService} from "./util/auth";

import AlertComponent from "./components/ui/AlertComponent"
import { Component } from "lucide-react-native";



const {ReaderModule} = NativeModules;
const { KeyEventModule } = NativeModules;

// const eventEmitter = new NativeEventEmitter(ReaderModule);
// const {ScanKeyModule} = NativeModules;




function RfidPage({ navigation }){
    const [TagNo,setTagNo] = useState('');
    const [TagArray,setTagArray] = useState([]);
    const [TruckNo,setTruckNo] = useState('');
    const [isReading,setisReading] = useState(false);

    const authCtx = useContext(AuthContext);
    const [showAlert, setshowAlert] = useState(false);
    const [alertMessage, setalertMessage] = useState('');
    const [alertStatus, setalertStatus] = useState('');




    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('DataFromNative', data => {
          if (!authCtx.isTruckFound){
            setTagNo(data);
            setTruckNo('Getting Truck No...... ');
            const result =  getTrucData(data);
          }else{
            // StopInventory();
          }
         
          
        });
        return () => {
          subscription.remove();
        };
      }, []);

      useEffect(() => {
        const eventEmitter = new NativeEventEmitter(KeyEventModule);
    
        // Add a listener for the 'onKeyDown' event
        const keyDownListener = eventEmitter.addListener('onKeyUp', event => {
          console.log('Key down event received:', event);
          // Handle the key down event here
        });
    
        // Clean up the listener when the component unmounts
        return () => {
          keyDownListener.remove();
        };
      }, []); // Empty dependency array ensures that this effect runs once after the initial render
    


      useEffect(() => {
        const backAction = () => {
            console.log("Back Button Pressed!!!");
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      }, []); // Empty dependency array means this effect will only run once
    




 function StartInventory(){
    console.log("Inventory Started!!!");
    authCtx.isTruckFound = false;
    setisReading(true);
    ReaderModule.StartInventory();
}

function StopInventory(){
    console.log("Inventory Stoped!!!");
    setisReading(false);
    ReaderModule.stopInventory();
}

// async function getTag() {
//     try {
//         setTruckNo("");
//         setTagNo("");
//         setisTruckFound(false);
//         message ="";
//         setTagArray([]);
//         setisReading(true);
//         for(var i = 1;i <= 5;i++){
//             const token = await ReaderModule.getSingleTag('RFID', message => {
//                 // setTagArray(prevTagArray => [...prevTagArray, message]);
//                 if (authCtx.currentPageName == 'Truck Register') {
//                     if(message.indexOf('3014') >= 0){
//                         setTagNo(message);
//                         return;
//                     }
//                 }
//                 setTagNo(message);
//                 setTruckNo('Getting Truck No...... ');
//                 const result =  getTrucData(message);
//             });
      
//         }

      

//     } catch (error) {
//       setisReading(false);
//     }
//   }

  async function getTrucData(message){
    if (message !== "NO TAG"){
      const token = await getTruckNo(authCtx.currentPlantCode, message);
      if (token){
          StopInventory();
          authCtx.isTruckFound = true;
          setTruckNo(token.VEHICLE_NO);
          setTagNo(token.RFID);  
      }else{
        if (!authCtx.isTruckFound){
          setTruckNo('Truck Not Found!!!');
        }
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
    authCtx.isTruckFound = false;
    setTagArray([]);
  }
  

  function acknowledgeResponse(){
    setshowAlert(false);
    if (authCtx.currentPageName !== 'Truck Register'){
        setTruckNo("");
        setTagNo("");
    }
    authCtx.isTruckFound = false;
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
                                <Button  w={"$1/3"} onPress={clearTag}action="negative" >
                             
                                  <ButtonText color="$white" >Clear</ButtonText> 
                                    
                                </Button>

                                {/* <Button  w={"$1/2.5"} onPress={getTag} action="primary"  focusable={true} isFocused={true}>
                                    {isReading && <ButtonSpinner /> }
                                    {!isReading && <ButtonText color="$white" >Get</ButtonText> }
                                    
                                </Button> */}

                                <Button  w={"$1/3"} onPress={StartInventory} action="primary"  focusable={true} isFocused={true}>
                                    {isReading && <ButtonSpinner /> }
                                    {!isReading && <ButtonText color="$white" >Start</ButtonText> }
                                </Button>

                                <Button  w={"$1/3"} onPress={StopInventory} action="primary"  focusable={true} isFocused={true}>
                                <ButtonText color="$white" >Stop</ButtonText> 
                                </Button>


                            </HStack>

                            <Text color="$text900" lineHeight="$xs" >Truck No</Text>
                            <Input isDisabled={true}>
                                <InputField type="text"  value={TruckNo} />
                            </Input>
                            
                        </VStack>

                        <Divider my="$4" />

                            {(authCtx.isTruckFound || authCtx.currentPageName == 'Truck Register') &&
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