// components/Welcome.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { auth } from '../firebaseConfig';

const Welcome = ({ navigation }) => {
  const userEmail = auth.currentUser.email;

  const handlePress = () => {
    navigation.navigate('UserDashboard');
  };

  return (
    <ImageBackground
      source={require('../assets/back.webp')} // Resim dosyanızın yolunu belirtin
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/kullanic.jpg')} // Hoşgeldin resminin yolu
          style={styles.welcomeImage}
        />
        <Text style={styles.welcomeText}>Hoşgeldin, {userEmail}!</Text>
        <Text></Text>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>Cüzdan Oluştur</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Daire şeklinde köşeler için
    marginBottom: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  subText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Welcome;
