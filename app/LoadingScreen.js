import { useContext,useEffect,useState} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { AuthContext } from "./store/auth-context";

const LoadingScreen = ({ navigation }) => {
const[isLoading,setisLoading]= useState(true);
const authCtx = useContext(AuthContext);
    
  useEffect(() => {
    async function getUserToken(){
      try {
        navigation.navigate('Login');
        const userToken = await AsyncStorage.getItem('rfidUserToken');
        if (userToken !== null) {
          console.log('User token retrieved:', userToken);
          
          authCtx.isAuthenticated = true;
          const userName = await AsyncStorage.getItem('rfidUserName');
          authCtx.userName1 = userName;

          const plantCode = await AsyncStorage.getItem('rfidPlantCode');
          authCtx.currentPlantCode = plantCode;

          const plantName = await AsyncStorage.getItem('rfidPlantName');
          authCtx.currentPlantName = plantName;
          setisLoading(false);
          navigation.navigate('Home');
          return userToken;
        } else {
          console.log('No user token found');
          setisLoading(false);
          navigation.navigate('Login');
          return null;
        }
      } catch (error) {
        setisLoading(false);
        console.error('Error retrieving user token:', error);
        return null;
      }
    }
    getUserToken();
  },[]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;