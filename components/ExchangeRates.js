import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
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
    <View>
      <Text>Döviz Kurları:</Text>
      {rates.map((rate, index) => (
        <Button
          key={index}
          title={`${rate.$.Kod}: ${rate.ForexSelling.map((selling) => selling)}`}
          onPress={() => addCurrencyToWallet(rate.$.Kod)}
        />
      ))}
    </View>
  );
};

export default ExchangeRates;
