import Login from './screens/Login';
import Register from './screens/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Welcome from './components/Welcome';
import WelcomeAdmin from './components/WelcomeAdmin'; // Yeni eklenen dosyayı içe aktar

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChangedHandler = (user) => {
    setUser(user);
    setInitializing(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return null; // Auth durumu başlatılıyor ise bir şey gösterme
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'UserDashboard' : 'Login'}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="WelcomeAdmin" component={WelcomeAdmin} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;