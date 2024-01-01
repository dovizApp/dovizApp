import React, { useState,useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExchangeRates from './ExchangeRates';
import { db,auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

// Configure Expo Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


  const UserDashboard = () => {
    const [rates, setRates] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [wallet, setWallet] = useState([]);
    const [userEmail, setUserEmail] = useState(''); // Kullanıcının e-posta adresini burada alabilirsiniz
    
    
    useEffect(() => {
      // Kullanıcı giriş yaptığında email bilgisini al
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserEmail(currentUser.email);
      }
    }, []); // Boş dependency array, sadece bir kere çalışmasını sağlar

  const addCurrencyToWallet = (currency) => {
    const selectedRate = rates.find(rate => rate.$.Kod === currency);
    
    if (selectedRate) {
      const rateValue = selectedRate.ForexSelling[0];
      const walletItem = {
        currency,
        rate: parseFloat(rateValue),
        amount: 1, // Kullanıcıdan alınan miktar, örneğin 1 olarak sabit tuttum.
      };

      setWallet([...wallet, walletItem]);

      // Firestore'a cüzdan bilgisini kaydet
      saveWalletToFirestore(walletItem);
    }
  };
  const saveWalletToFirestore = async (walletItem) => {
    try {
      // Firestore'da kullanıcının cüzdan koleksiyonunu kullanabilirsiniz
      const walletRef = collection(db, 'wallets');
      
      // Cüzdan bilgilerini Firestore'a ekle
      await addDoc(walletRef, {
        userEmail,
        currency: walletItem.currency,
        rate: walletItem.rate,
        amount: walletItem.amount,
      });

      console.log('Cüzdan Firestore\'a kaydedildi.');

      // Check if the wallet amount exceeds 100 TL
      if (totalWalletPrice > 100) {
        sendNotification();
      }

    } catch (error) {
      console.error('Cüzdan kaydetme hatası:', error);
    }
  };

  const sendNotification = async () => {
    const token = await Notifications.getExpoPushTokenAsync();

    // Send a push notification
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: 'Wallet Exceeded 100 TL',
        body: 'Your wallet amount has exceeded 100 TL.',
      }),
    });
  };




  // Cüzdan toplam fiyatını hesapla
  const totalWalletPrice = wallet.reduce((total, item) => total + (item.rate * item.amount), 0);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ExchangeRates setRates={setRates} addCurrencyToWallet={addCurrencyToWallet} />

        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {rates.map((rate, index) => (
            <Picker.Item key={index} label={rate.$.Kod} value={rate.$.Kod} />
          ))}
        </Picker>
        
        <View style={styles.walletContainer}>
          <Text>Cüzdanınız:</Text>
          {wallet.map((item, index) => (
            <Text key={index}>
              {item.currency}: {item.amount} * {item.rate.toFixed(2)} = {(item.amount * item.rate).toFixed(2)}
            </Text>
          ))}
        </View>

        <Text>Toplam Cüzdan Fiyatı: {totalWalletPrice.toFixed(2)}</Text>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletContainer: {
    marginTop: 20,
  },
});

export default UserDashboard;
