import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { collection, getDocs, where, query, deleteDoc, doc } from 'firebase/firestore';
import { Alert } from 'react-native';
import {  db,auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';



const AdminDashboard = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false); // Yenileme bayrağı

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = await Promise.all(usersSnapshot.docs
          .filter(doc => doc.data().roles.includes('user'))
          .map(async doc => {
            const userData = {
              id: doc.id,
              ...doc.data(),
            };

            const walletsSnapshot = await getDocs(query(collection(db, 'wallets'), where('userEmail', '==', userData.email)));
            const walletData = walletsSnapshot.docs.map(walletDoc => walletDoc.data());

            userData.wallets = walletData;

            return userData;
          })
        );
        setUsers(usersData);
      } catch (error) {
        console.error('Kullanıcıları getirme hatası:', error);
      }
    };

    fetchUsers();
    setRefreshPage(false); // Sayfa yenileme bayrağını sıfırla
  }, [refreshPage]); // Sayfa yenileme bayrağına bağlı olarak sadece bayrak değiştiğinde çalışır

  const calculateTotalAmount = (userEmail) => {
    const user = users.find(user => user.email === userEmail) || {};
    const userWallets = user.wallets || [];
    const totalAmount = userWallets.reduce((total, wallet) => total + wallet.rate, 0);
    return totalAmount.toFixed(2);
  };

  const handleDeleteUser = async (userId, userEmail) => {
    try {
      await deleteDoc(doc(db, 'users', userId));

      const walletsSnapshot = await getDocs(query(collection(db, 'wallets'), where('userEmail', '==', userEmail)));
      await Promise.all(walletsSnapshot.docs.map(walletDoc => deleteDoc(doc(db, 'wallets', walletDoc.id))));
  
      console.log('Kullanıcı başarıyla silindi.');
      // Success alert
      Alert.alert(
        'Başarı !',
        'Kullanıcı başarı ile silindi.',
        [
          {
            text: 'Tamam',
            onPress: () => setRefreshPage(true), // Sayfa yenileme bayrağını aktifleştir
          },
        ]
      );
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Kullanıcı Listesi</Text>
      {users.map((user, index) => (
        <View key={index} style={styles.userContainer}>
          <Text style={styles.userTitle}>Kişi {index + 1}: {user.email}</Text>
          
          <Text style={styles.walletText}>Cüzdan Tutarı: {calculateTotalAmount(user.email)}</Text>
          <Button
            title="Kullanıcıyı Sil"
            onPress={() => handleDeleteUser(user.id, user.email)}
            
          />
        </View>
        
      ))}
      
      <Button
        title="Çıkış Yap"
        onPress={async () => {
          Alert.alert('Çıkış Yapılıyor', 'Çıkış yapılıyor...');
          await signOut(auth); // Kullanıcının oturumunu sonlandır
          navigation.navigate('Login'); // Login sayfasına yönlendir
        }}
      />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor:"pink"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userContainer: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 20,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletText: {
    marginBottom: 50,
  },
});

export default AdminDashboard;
