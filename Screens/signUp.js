import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, 
KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { users } from '../models/users'; 


export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(false);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const signUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi girin.");
      return;
   }
   

    try {
      const result = await users.addUser(email, fullName, password);
      if (result.success) {
        Alert.alert("Başarılı", "Hesap başarıyla oluşturuldu.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Hata", result.error,[{text:"tamam"}]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Bir hata oluştu.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}> 
          <Image source={require('../assets/icons/toDoListLogo.png')} style={styles.logo} />
          
          <TextInput  autoCapitalize="none" placeholder="Email" value={email} onChangeText={setEmail} style={styles.TextInput} />
          <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.TextInput} />
          
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Password" value={password} secureTextEntry={secureText} onChangeText={setPassword} style={styles.TextInput}  />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
              <Image source={secureText ? require('../assets/icons/eye-off.png') : require('../assets/icons/eye.png')} style={styles.eyeImage} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Confirm Password" value={confirmPassword} secureTextEntry={secureTextConfirm} onChangeText={setConfirmPassword} style={styles.TextInput} />
            <TouchableOpacity onPress={() => setSecureTextConfirm(!secureTextConfirm)} style={styles.eyeIcon}>
              <Image source={secureTextConfirm ? require('../assets/icons/eye-off.png') : require('../assets/icons/eye.png')} style={styles.eyeImage} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={signUp} style={styles.signInButton}>
            <Text style={styles.signInText}>SIGN UP</Text>
          </TouchableOpacity>
          
          <View style={styles.signInContainer}>
            <Text style={styles.signInPrompt}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    margin: 70,
  },
  TextInput: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
    height: 40
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    alignItems: "center",
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    paddingRight:10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeImage: {
    width: 24,
    height: 24,
  },
  signInButton: {
    backgroundColor: "#F79E89",
    borderRadius: 10,
    padding: 13,
    width: "90%",
    marginBottom: 10,
    marginTop: 10,
  },
  signInText: {
    textAlign: "center",
    color: "white",
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInPrompt: {
    color: "#272727",
    opacity: 0.4,
  },
  signInLink: {
    color: "orange",
    marginLeft: 5,
  },
});
