import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import xml2js from 'react-native-xml2js';

const ExchangeRates = ({ setRates, addCurrencyToWallet }) => {
  const [rates, setRatesLocal] = useState([]);

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
          setRatesLocal(currencyRates);
          setRates(currencyRates);
        });
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchExchangeRates();
  }, [setRates]);

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text>Döviz Kurları:</Text>
      <Text></Text>
      <View style={styles.buttonContainer}>
        {rates.map((rate, index) => (
          <Button
            key={index}
            title={`${rate.$.Kod}: ${rate.ForexSelling.map((selling) => selling)}`}
            onPress={() => addCurrencyToWallet(rate.$.Kod)}
            style={styles.button}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 5,
    width: '40%', // Adjust the width as needed
  },
});

export default ExchangeRates;
