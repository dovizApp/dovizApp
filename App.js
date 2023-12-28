<<<<<<< HEAD
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import 'firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import Register from './screens/Register';

import app from './firebaseConfig'; // firebaseConfig dosyanızın bulunduğu yola göre düzenleyin


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
=======
import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function App() {
  let [isLoading, setIsLoading] = useState(true);
  let [error, setError] = useState();
  let [response, setResponse] = useState();

  useEffect(() => {
    fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then(res => res.json())
    .then(
      (result) => {
        setIsLoading(false);
        setResponse(result);
      },
      (error) => {
        setIsLoading(false);
        setError(error);
      }
    )
  }, [] );

  const getContent = () => {
    if (isLoading){
      return <ActivityIndicator size="large" />;
    }

     if (error){
      return <Text>{error}</Text>
    }
    console.log(response);
    return <Text>Bitcoin (USD) :{response && response.bpi && response.bpi.USD && response.bpi.USD.rate}</Text> ;

   
  };

  return (
    <View style={styles.container}>
      {getContent()}
      <StatusBar style="auto" />
    </View>
>>>>>>> 43dfbbb35dd37593fa3c77c22acef6bdff9f36cc
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
