
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';


const WelcomeAdmin = ({ user, navigation }) => {
    const handlePress = () => {
      // Kullanıcıları listeleme sayfasına yönlendir
      navigation.navigate('AdminDashboard');
    };
  
    return (
      <ImageBackground
        source={require('../assets/kuzey.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          
          <TouchableOpacity onPress={handlePress}>
          <Text style={styles.linkText}>Hoşgeldin,Admin! </Text>
            <Text style={styles.linkText}>Kullanıcıları listelemek için tıklayınız</Text>
            
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
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'white',
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
  });
  
  export default WelcomeAdmin;
