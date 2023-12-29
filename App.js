import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import xml2js from 'react-native-xml2js';

const ExchangeRates = () => {
  const [rates, setRates] = useState(null);

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

  return (
    <View>
      <Text>Döviz Kurları:</Text>
      {rates &&
        rates.map((rate, index) => (
          <Text key={index}>
            {rate.$.Kod}: {rate.ForexSelling.map((selling) => selling)}
          </Text>
        ))}
    </View>
  );
};

export default ExchangeRates;