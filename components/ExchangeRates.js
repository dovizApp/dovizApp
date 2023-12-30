import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import xml2js from 'react-native-xml2js';
import { Picker } from '@react-native-picker/picker';



const ExchangeRates = () => {
  const [rates, setRates] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
        const xmlData = await response.text();

        // XML verisini JavaScript nesnelerine dönüştürme
        xml2js.parseString(xmlData, (err, result) => {
          if (err) {
            console.error('XML parse hatası:', err);
            return;
          }

          // Döviz kurları JavaScript nesneleri olarak result objesinde bulunabilir
          const currencyRates = result.Tarih_Date.Currency;
          setRates(currencyRates);
        });
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const addCurrencyToWallet = () => {
    const selectedRate = rates.find(rate => rate.$.Kod === selectedCurrency);
    
    if (selectedRate) {
      const rateValue = selectedRate.ForexSelling[0];
      const walletItem = {
        currency: selectedCurrency,
        rate: parseFloat(rateValue),
        amount: 1, // Kullanıcıdan alınan miktar, örneğin 1 olarak sabit tuttum.
      };

      setWallet([...wallet, walletItem]);
    }
  };

  // Cüzdan toplam fiyatını hesapla
  const totalWalletPrice = wallet.reduce((total, item) => total + (item.rate * item.amount), 0);

  return (
    <View style={styles.container}>
      <Text>Döviz Kurları:</Text>
      <Picker
        selectedValue={selectedCurrency}
        onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
      >
        {rates && rates.map((rate, index) => (
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
      
      <Button title="Cüzdana Ekle" onPress={addCurrencyToWallet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletContainer: {
    marginTop: 20,
  },
});

export default ExchangeRates;
