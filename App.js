import Login from './screens/Login';
import Register from './screens/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig';

//import app from './firebaseConfig'; // firebaseConfig dosyanızın bulunduğu yola göre düzenleyin


const Stack = createNativeStackNavigator();

export default function App() {
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

  if (!user) {
    return (
      // Kullanıcı oturumu açmamışsa giriş ekranını göster
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (user && user.roles && user.roles.includes('admin')) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AdminDashboard">
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="UserDashboard">
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});