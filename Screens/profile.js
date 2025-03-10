import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { users } from "../models/users"; // Kullanıcı sınıfını import et
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
    const [confirmUser, setConfirmUser] = useState(null);

    // Kullanıcı verilerini AsyncStorage'dan al
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await users.getCurrentUser(); // AsyncStorage'dan geçerli kullanıcıyı al
                if (currentUser) {
                    setConfirmUser(currentUser); // Kullanıcıyı bulduğunda veriyi state'e set et
                }
            } catch (error) {
                console.error('Kullanıcı verisi alırken hata oluştu:', error);
            }
        };

        fetchUserData(); // Komponent yüklendiğinde kullanıcı verisini al
    }, []);

    // Çıkış yapma işlemi
    const handleLogout = async () => {
        try {
            await users.logout();  // Kullanıcıyı çıkartmak için users sınıfını kullan
            const currentUser = users.getCurrentUser();
            AsyncStorage.setItem('userSession', JSON.stringify({ isLoggedIn: false, userId: currentUser.id }));
           navigation.navigate("Login");
        } catch (error) {
            console.error('Çıkış yaparken hata:', error.message);
        }
    };

    // Ana sayfaya geri gitme fonksiyonu
    const backPageNavigation = () => {
        navigation.navigate("MainPage");
    };

    return (
        <View>
            <View style={styles.headContainer}>
                <View style={styles.headContainer2}>
                    <TouchableOpacity onPress={backPageNavigation}>
                        <Image source={require("../assets/icons/back.png")} style={{ marginRight: 10, padding: 15 }} />
                    </TouchableOpacity>
                    <Text style={styles.textStyle}>TO DO LIST</Text>
                </View>
                <Image source={require("../assets/icons/settings.png")} style={{ width: 24, height: 24 }} />
            </View>

            <View style={styles.container}>
                <Image source={require("../assets/image/rafiki.png")} style={{ width: 250, height: 250, margin: 40 }} />

                <View style={{ width: "90%" }}>
                    {/* Kullanıcı bilgilerini görüntüle */}
                    {confirmUser ? (
                        <>
                            <View style={styles.userInfoRow}>
                                <Text style={styles.label}>Full Name:</Text>
                                <Text style={styles.value}>{confirmUser?.fullName}</Text>
                            </View>
                            <View style={styles.userInfoRow}>
                                <Text style={styles.label}>Email:</Text>
                                <Text style={styles.value}>{confirmUser?.email}</Text>
                            </View>
                            <View style={styles.userInfoRow}>
                                <Text style={styles.label}>Password:</Text>
                                <Text style={styles.value}>{confirmUser?.password}</Text>
                            </View>
                        </>
                    ) : (
                        <Text>Kullanıcı verisi yükleniyor...</Text>  // Kullanıcı verisi yüklenene kadar mesaj göster
                    )}
                </View>

                <TouchableOpacity onPress={handleLogout} style={styles.logOutButton}>
                    <Text style={{ textAlign: "center", color: "white" }}>LOG OUT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headContainer2: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    userInfoRow: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: "space-between",
        marginVertical: 10
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "#272727",
        opacity: 0.5
    },
    value: {
        fontSize: 16,
        color: "#F79E89",
    },
    logOutButton: {
        backgroundColor: '#F79E89',
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 40,
        width: "80%"
    },
    headContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginVertical: 10,
        marginTop: 40,
    },
    textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#F79E89",
    },
});
