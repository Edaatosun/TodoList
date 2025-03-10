import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';


const CountdownTimer = ({ createdAt, deadline }) => {

  const correctDateForCreated = createdAt.split(".").reverse().join("-"); 
  const correctDateFordeadline = deadline.split(".").reverse().join("-"); 

  

  if (!createdAt || !deadline) {
    return <Text>Geçersiz tarih bilgisi!</Text>;
  }

  const startDate = new Date(correctDateForCreated);
  const endDate = new Date(correctDateFordeadline);

  const [timeLeft, setTimeLeft] = useState(endDate-startDate);  
  const [isCompleted, setIsCompleted] = useState(false);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return <Text>Tarih bilgisi hatalı!</Text>;
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
    }
    const interval = setInterval(() => {
      // callBack fonk
      //mevcut değeri alır ve yeni değeri döndürür.
      setTimeLeft((prevTime) => prevTime - 1000);  // Her saniye 1000ms azalt
    }, 1000);

    // eski intervali temizle 
    // javascript tarafından built-in fonk.
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye`;
  };

  return (
    <View style={{ padding: 20 }}>
      {isCompleted ? (
        <Text>Zamanlayıcı bitti!</Text>
      ) : (
        <Text>Geri sayım: {formatTime(timeLeft)}</Text>
      )}
    </View>
  );
};

export default CountdownTimer;
