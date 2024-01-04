import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExchangeRates from './ExchangeRates';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, addDoc, doc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
              shouldPlaySound: false,
              shouldSetBadge:false,
              shouldShowAlert: true 
    };
  }
});
const UserDashboard = ({ navigation }) => {
  const [rates, setRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [wallet, setWallet] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [currencyToDelete, setCurrencyToDelete] = useState('');
  const totalWalletPrice = wallet.reduce((total, item) => total + item.amount * item.rate, 0);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const userEmail = auth.currentUser.email;
        const walletSnapshot = await getDocs(query(collection(db, 'wallets'), where('userEmail', '==', userEmail)));
        const walletData = walletSnapshot.docs.map((walletDoc) => walletDoc.data());

        if (walletData.length > 0) {
          setSelectedCurrency(walletData[0].currency);
        }
        setWallet(walletData);
      } catch (error) {
        console.error('Cüzdan verilerini alma hatası:', error);
      }
    };

    fetchWalletData();
  }, []);

  const handleDeleteCurrency = async () => {
    try {
      if (!currencyToDelete) {
        Alert.alert('Hata', 'Lütfen silmek istediğiniz para birimini girin.');
        return;
      }

      const currencyToDeleteItem = wallet.find((item) => item.currency === currencyToDelete);

      if (!currencyToDeleteItem) {
        Alert.alert('Hata', `Cüzdanınızda ${currencyToDelete} bulunmamaktadır.`);
        return;
      }

      const walletRef = collection(db, 'wallets');
      const querySnapshot = await getDocs(
        query(walletRef, where('userEmail', '==', auth.currentUser.email), where('currency', '==', currencyToDelete))
      );
      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(walletRef, docToDelete.id));

        const updatedWallet = wallet.filter((item) => item.currency !== currencyToDeleteItem.currency);
        setWallet(updatedWallet);
        Alert.alert('Başarı', `${currencyToDelete} başarıyla silindi.`);
      } else {
        Alert.alert('Hata', `Cüzdanınızda ${currencyToDelete} bulunmamaktadır.`);
      }
    } catch (error) {
      console.error('Cüzdan verisi silme hatası:', error);
    }
  };

  const addCurrencyToWallet = (currency) => {
    const selectedRate = rates.find((rate) => rate.$.Kod === currency);

    if (selectedRate) {
      const rateValue = selectedRate.ForexSelling[0];
      const walletItem = {
        currency,
        rate: parseFloat(rateValue),
        amount: 1,
      };

      setWallet([...wallet, walletItem]);

      saveWalletToFirestore(walletItem);
    }
  };

  const saveWalletToFirestore = async (walletItem) => {
    try {
      const walletRef = collection(db, 'wallets');
      const userEmail1 = auth.currentUser.email;

      await addDoc(walletRef, {
        userEmail: userEmail1,
        currency: walletItem.currency,
        rate: walletItem.rate,
        amount: walletItem.amount,
      });

      console.log('Cüzdan Firestore\'a kaydedildi.');
    } catch (error) {
      console.error('Cüzdan kaydetme hatası:', error);
    }
  };

  const sendNotification = async () => {
    // Bildirim içeriği
    const notificationContent = {
      title: 'Cüzdan Uyarısı',
      body: 'Cüzdan tutarınız 100 TL\'nin üzerine çıktı!',
    };

    // Bildirimi gönder
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: {
        seconds:3,
      }, // Anında gönder
    });
  };

  // Cüzdan tutarı değiştiğinde kontrol et
  useEffect(() => {
    if (totalWalletPrice > 100) {
      sendNotification();
    }
  }, [totalWalletPrice]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ExchangeRates setRates={setRates} addCurrencyToWallet={addCurrencyToWallet} />

        <Picker selectedValue={selectedCurrency} onValueChange={(itemValue) => setSelectedCurrency(itemValue)}>
          {rates.map((rate, index) => (
            <Picker.Item key={index} label={rate.$.Kod} value={rate.$.Kod} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Silmek istediğiniz para birimini girin"
          onChangeText={(text) => setCurrencyToDelete(text)}
        />
        <Button title="Sil" onPress={handleDeleteCurrency} />

        <View style={styles.walletTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.currencyColumn}>Doviz     </Text>
            <Text style={styles.amountColumn}>Miktar      </Text>
            <Text style={styles.rateColumn}>Fiyat         </Text>
            <Text style={styles.totalColumn}>Toplam </Text>
          </View>

          {wallet.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.currencyColumn}>{item.currency}</Text>
              <Text style={styles.amountColumn}>{item.amount}</Text>
              <Text style={styles.rateColumn}>{item.rate.toFixed(2)}</Text>
              <Text style={styles.totalColumn}>{(item.amount * item.rate).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>Toplam Cüzdan Fiyatı: {totalWalletPrice.toFixed(2)}</Text>
        <Text></Text>
        <Button
          title="Çıkış Yap"
          onPress={async () => {
            Alert.alert('Çıkış Yapılıyor', 'Çıkış yapılıyor...');
            await signOut(auth); // Kullanıcının oturumunu sonlandır
            navigation.navigate('Login'); // Login sayfasına yönlendir
          }}
        />
        <Text></Text>
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  total: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserDashboard;
