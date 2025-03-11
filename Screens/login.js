import { 
  StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView 
} from 'react-native';
import { useEffect, useState } from 'react';
import { users } from '../models/users';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  // useEffect ile uygulama yeniden başladığında AsyncStorage'dan kullanıcı durumu kontrol edilir
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.isLoggedIn) {
          // Oturum açılmışsa MainPage'e yönlendir
          navigation.navigate("MainPage");
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Giriş yapma fonksiyonu
  const signIn = async () => {
    if (!email || !password) {
      return Alert.alert("HATA", "E-posta ve şifre boş olamaz.");
    }

    setLoading(true);

    try {
      const result = await users.login(email, password);
      setLoading(false);

      if (result.success) {
        Alert.alert("Başarılı", "Başarıyla giriş yapıldı!");

        // Kullanıcı ID'sini almak ve AsyncStorage'a kaydetmek
        const userId = result.user.userId; // kullanıcı id'sini login işleminden alıyoruz
        await AsyncStorage.setItem('userSession', JSON.stringify({ isLoggedIn: true, userId: userId }));
        
        // Ana sayfaya yönlendirme
        navigation.navigate("MainPage");
      } else {
        Alert.alert("HATA", result.error);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("HATA", "Giriş sırasında bir hata oluştu.");
    }
  };

  // Sayfa navigasyonu
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Şifre görünürlüğünü aç/kapa
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          
          <View style={styles.innerContainer}>
            <Image
              source={require('../assets/icons/toDoListLogo.png')}
              style={styles.logo}
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.TextInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.TextInput}
                secureTextEntry={secureText}
              />
              <TouchableOpacity onPress={toggleSecureText} style={styles.eyeIcon}>
                <Image
                  source={secureText ? require('../assets/icons/eye-off.png') : require('../assets/icons/eye.png')}
                  style={styles.eyeImage}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.fpStyles}>
              <TouchableOpacity onPress={() => navigateTo('ChangePassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={signIn} style={styles.signInButton} disabled={loading}>
              <Text style={styles.signInText}>
                {loading ? "Giriş Yapılıyor..." : "SIGN IN"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigateTo('SignUp')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    margin: 50,
  },
  TextInput: {
    borderWidth: 1,
    width: "90%",
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
    height:40
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    alignItems: "center",
  },
  eyeIcon: {
    position: 'absolute',
    right: 30,
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
    marginBottom: 5,
  },
  signInText: {
    textAlign: "center",
    color: "white",
  },
  fpStyles: {
    width: '90%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    margin: 5,
  },
  forgotPasswordText: {
    color: "#272727",
    textAlign: 'left',
    opacity: 0.5,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: "#272727",
    opacity: 0.4,
  },
  signUpLink: {
    color: "orange",
    marginLeft: 5,
  },
});
