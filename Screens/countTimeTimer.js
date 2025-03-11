import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';


const CountdownTimer = ({ createdAt, deadline }) => {

  let correctDateForCreated, correctDateFordeadline;

  if(Platform.OS==="android"){
    correctDateForCreated = createdAt.split(".").reverse().join("-"); 
    const [day2, month2, year2] = deadline.split("."); 
    correctDateFordeadline = `${year2}-${month2}-${day2}`;
  }
  else{
    correctDateForCreated = createdAt.split(".").reverse().join("-"); 
    const [month2,day2 , year2] = deadline.split("/"); 
    if(month2<10){
      correctDateFordeadline = `${year2}-${0}${month2}-${day2}`;

    }
    else{
      correctDateFordeadline = `${year2}-${month2}-${day2}`;
    }
    
  }

  

  

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
    
  }, [timeLeft]);

  const formatTime = (milliseconds) => {
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return `${days} gün kaldı.`;
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
