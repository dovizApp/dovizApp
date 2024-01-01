// components/Welcome.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const Welcome = ({ navigation, user }) => {
  const handlePress = () => {
    navigation.navigate('UserDashboard');
  };

  return (
    <ImageBackground
      source={require('../assets/kuzey.jpg')} // Resim dosyanızın yolunu belirtin
      style={styles.background}
    >
      <View style={styles.container}>
      <Text style={styles.linkText}>Hoşgeldin,Kullanıcı! </Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.linkText}>Cüzdan oluşturmak ve işlemlerinizi gerçekleştirmek için tıklayın</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // veya 'stretch' ya da 'contain' kullanabilirsiniz
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Saydamlık ekleyebilirsiniz
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  linkText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default Welcome;
