/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect,useContext, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import LoginPage from "./app/LoginPage";
import HomePage from "./app/HomePage";
import HeaderTop from "./app/HeaderTop"
import RfidPage from "./app/RfidPage"
import LoadingScreen from './app/LoadingScreen';
import {login} from "./app/util/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, { AuthContext } from "./app/store/auth-context";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Heading,Image
   } from "@gluestack-ui/themed"
import { Component } from 'lucide-react-native';



type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}




function App(): JSX.Element {
  const[isLoading,setisLoading]= useState(true);
  const isDarkMode = useColorScheme() === 'dark';
 

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const authCtx = useContext(AuthContext);
  const Stack = createNativeStackNavigator();




  const handleLogout = (navigation :any) => {
    console.log('Logged Out');
    authCtx.isAuthenticated = false;
    authCtx.userName1 ="";
    AsyncStorage.removeItem('rfidUserToken');
    AsyncStorage.removeItem('rfidUserName');
    navigation.navigate('Login');
  };



  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AuthContextProvider>
          <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{
                  headerBackVisible: false,
                }}
            >
             
              {/* {isLoading ? <Stack.Screen name="LoadingScreen"   component={LoadingScreen}/>:
              <Stack.Screen name="Login"   component={LoginPage} options={({ navigation }) => ({
                  headerTitle: () => <HeaderTop onPress={() => handleLogout(navigation)} />,
                })} 
                />
              } */}

              <Stack.Screen name="LoadingScreen"   component={LoadingScreen} 
               options={{ headerShown: false }}
              />
   

              <Stack.Screen name="Login"   component={LoginPage} options={({ navigation }) => ({
                  headerTitle: () => <HeaderTop onPress={() => handleLogout(navigation)} />,
                })} 
                />
           

              <Stack.Screen name="Home" component={HomePage}

                options={({ navigation }) => ({
                  headerTitle: () => <HeaderTop onPress={() => handleLogout(navigation)} />,
                })}
              />
           

           <Stack.Screen name="Process" component={RfidPage}

                options={({ navigation }) => ({
                  headerTitle: () => <HeaderTop onPress={() => handleLogout(navigation)} />,
                })}
              />

            </Stack.Navigator>
          </NavigationContainer>
      </AuthContextProvider>
    </GluestackUIProvider>
  );


  
}


const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
