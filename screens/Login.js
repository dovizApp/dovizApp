// screens/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import { auth ,db} from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'dan kullanıcı verilerini al
      const userDocSnapshot = await getDoc(doc(db, 'users', user.uid));

      // Kullanıcı Firestore'da kayıtlı ise rollerini kontrol et
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userRoles = userData.roles || [];
        console.log('Giriş başarılı!');
        
        navigation.replace(userRoles.includes('admin') ? 'WelcomeAdmin' : 'Welcome');
      }else {
          console.error('Firestore\'da kullanıcı kaydı bulunamadı.');
        }

    } catch (error) {
      console.error('Giriş hatası:', error.message);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text>Lütfen kullanıcı bilgilerinizi girerek sisteme giriş yapınız.</Text>
      <Text>  </Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Text></Text>
      <Button title="Login" onPress={handleLogin} />
      <Text></Text>
      <Text onPress={navigateToRegister}>Hesabınız yok mu ? </Text>
      <Text></Text>
      <Text style={{ color: 'blue', fontWeight: 'bold', textDecorationLine: 'underline' }} onPress={navigateToRegister}>
        Buradan kayıt olun !
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"pink",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Login;
