// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Firebase modülünü doğru import et
import { doc, setDoc, collection } from 'firebase/firestore';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (password.length < 6) {
        Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
        return;
      }

      // Firebase Authentication ile kullanıcı kaydı yap
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı dökümanı ekle
      const userDocRef = doc(db, 'users', user.uid);

      // Yeni kayıt olan her kullanıcıya "user" rolü atandı
      await setDoc(userDocRef, {
        roles: ['user'],
        email: email
      });

      // Success alert
      Alert.alert(
        'Kayıt Oluşturuldu.',
        ' Giriş sayfasına yönlendiriliyorsunuz.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', `Kayıt hatası: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Kayıt Ekranı</Text>
      <Text></Text>
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Register;
