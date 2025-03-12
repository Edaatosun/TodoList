import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export class users {
  constructor(id, email, fullName, password) {
    this.id = id; // userId
    this.email = email;
    this.fullName = fullName;
    this.password = password;
  }

  // Kullanıcı ekleme fonksiyonu (kayıt işlemi)
  static async addUser(email, fullName, password) {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];

      // Aynı email ile kayıtlı kullanıcı var mı kontrol edelim
      const existingUser = usersList.find((user) => user.email === email);
      if (existingUser) {
        return { error: "Bu email adresine ait bir kullanıcı mevcuta \n Lütfen başka bir email deneyin!" };
      }

      // Yeni kullanıcı için UUID oluştur
      const newUser = new users(uuid.v4(), email, fullName, password);
      
      // Kullanıcıyı listeye ekleyelim
      usersList.push(newUser);

      // Güncellenmiş listeyi AsyncStorage'a kaydedelim
      await AsyncStorage.setItem("users", JSON.stringify(usersList));

      return { success: true, user: newUser };
    } catch (error) {
     
      return { error: "kullanıcı kayıt olurken bir hata oluştu." };
    }
  }

  // Kullanıcı giriş işlemi
  static async login(email, password) {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];

      // Email ve şifreyi eşleşen kullanıcıyı bul
      const user = usersList.find((u) => u.email === email && u.password === password);

      if (user) {
        // Kullanıcı giriş yaptı
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));

        return { success: true, user };
      } else {
        return { error: "Geçersiz email veya şifre" };
      }
    } catch (error) {
      return { error: "Giriş yaparken bir sorun oluştu." };
    }
  }

  // Oturumu açık olan kullanıcıyı getir
  static async getCurrentUser() {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  // Kullanıcı çıkış işlemi
  static async logout() {
    try {
      await AsyncStorage.removeItem("currentUser"); // Oturumu kapat
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: "An error occurred while logging out." };
    }
  }
}
