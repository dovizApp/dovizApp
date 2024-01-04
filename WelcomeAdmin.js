// components/WelcomeAdmin.js
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';

const WelcomeAdmin = ({ navigation }) => {
  const handlePress = () => {
    // Kullanıcıları listeleme sayfasına yönlendir
    navigation.navigate('AdminDashboard');
  };

  return (
    <ImageBackground
      source={require('../assets/back.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/admin.png')}
          style={styles.adminImage}
        />
        <Text style={styles.welcomeText}>Hoşgeldin, Admin!</Text>
        <Text></Text>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>Kullanıcıları Listele</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  adminImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
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

export default WelcomeAdmin;
