import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword({ navigation }) {
  const [email, setEmail] = useState(""); // Email ile kullanıcıyı arayacağız
  const [newPassword, setNewPassword] = useState("");

  // Şifre sıfırlama ve güncelleme işlemi
  const handlePasswordReset = async () => {
    try {
      // AsyncStorage'dan kullanıcıları al
      const users = await AsyncStorage.getItem('users');
      const usersArray = users ? JSON.parse(users) : [];

      // Email ile eşleşen kullanıcıyı bul
      const user = usersArray.find(user => user.email === email);

      if (user) {
        // Yeni şifreyi güncelle
        user.password = newPassword;

        // Güncellenmiş kullanıcı verilerini AsyncStorage'a kaydet
        await AsyncStorage.setItem('users', JSON.stringify(usersArray));

        Alert.alert("Başarılı", "Şifreniz başarıyla güncellenmiştir.");
        navigation.navigate("Login"); // Login sayfasına yönlendir
      } else {
        Alert.alert("Hata", "Bu email ile kayıtlı bir kullanıcı bulunamadı.");
      }
    } catch (error) {
      Alert.alert("Hata", "Şifre güncellenirken bir sorun oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icons/toDoListLogo.png')} style={styles.logo} />

      <TextInput
        placeholder="Email Adresinizi Girin"
        value={email}
        onChangeText={setEmail}
        style={styles.TextInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Yeni Şifre"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.TextInput}
        secureTextEntry
      />

      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
        <Text style={styles.buttonText}>Şifrenizi Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  TextInput: {
    borderWidth: 1,
    width: "90%",
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#F79E89",
    borderRadius: 10,
    padding: 13,
    width: "90%",
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
