// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';
import { auth ,db} from "../firebaseConfig"; // Firebase modülünü doğru import et

import { doc, setDoc, collection } from "firebase/firestore";



const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (password.length < 6) {
        console.error('Şifre en az 6 karakter olmalıdır.');
        return;
      }
      // Firebase Authentication ile kullanıcı kaydı yap
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      //await createUserWithEmailAndPassword(auth, email, password);
      // Firestore'a kullanıcı dökümanı ekle
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        roles: ["user"], // Yeni kullanıcıya varsayılan olarak "user" rolü atandı
      });


      console.log('Kayıt başarılı!');

      // Eğer belirli bir şart sağlanıyorsa (örneğin, belirli bir e-posta adresi), admin rolü ekle
    if (email === 'beyza@gmail.com' && password === 'beyza123') {
      await setDoc(userDocRef, { roles: ['user', 'admin'] }, { merge: true });
      
      console.log('Kullanıcı admin olarak işaretlendi.');
    }
    } catch (error) {
      console.error('Kayıt hatası:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Register Screen</Text>
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
      {password.length > 0 && password.length < 6 && (
        <Text style={styles.errorText}>Şifre en az 6 karakter olmalıdır.</Text>
      )}

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Register;
