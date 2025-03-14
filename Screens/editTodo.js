import { View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Animated, Pressable,Modal ,Dimensions,
  Image} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import DatePicker from '@react-native-community/datetimepicker';
import { getTodoList, removeImage, TodoModel } from '../models/todoModel';
import { useNavigation } from '@react-navigation/native';
import { users } from '../models/users';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

export default function EditTodo({ modalVisible, setModalVisible, todo }) {
  const navigation = useNavigation();
  const [Todo,setTodo] = useState(todo);
  const [head, setHead] = useState(Todo?.title || "");
  const [description, setDescription] = useState(Todo?.description || "");
  const [deadline, setDeadline] = useState(Todo?.deadLine || "");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [category, setCategory] = useState(Todo?.category || "");
  const [image, setImage] = useState(null);
  const slide = useRef(new Animated.Value(300)).current;
  const [todoListState, setTodoListState] = useState([]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const [newDate, setNewDate] = useState(new Date());


  // Animasyon 
  useEffect(() => {
    if (modalVisible) {
      slideUp();
    }
  }, [modalVisible]);

  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slide, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start(() =>{
      
      navigation.navigate("Details", { id: Todo.id });
      setModalVisible(false);
    } );
  };

  ////////////////////////////////

  // edit func.

  const editFunction = async () => {
    const currentUser = await users.getCurrentUser();
    if (!currentUser) return;



    try {
      await TodoModel.updateTodo(currentUser.id, Todo.id, head, description, deadline, category,image);
      navigation.navigate("MainPage");
      setModalVisible(false);
    } catch (error) {
      console.error("Hata oluştu: ", error);
    }

   
  };


  ////////////////////////////
  
  // izin durumları
  
    const pickImage = async () => {
      // İzin durumu kontrolü
      const resultAccess = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (resultAccess.status === "granted") {
        openGallery();
      } else {
        Alert.alert(
          "İzin Gerekli",
          "Galeriye erişim izni vermelisiniz.",
          [
            {
              text: "Tamam",
              onPress:  () => {
                Linking.openSettings();
              }
            },
            { text: "İptal", style: "cancel" }
          ]
        );
      }
    };
    // Galeriyi açan fonksiyon
    const openGallery = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // "video" eklenebilir
        allowsEditing: true, // düzenlemeye izin verme
        aspect: [4, 3], // kırpma işlemi sırasında [width, height] bunu verir.
        quality: 1, // kalite en düşük 0 en yüksek 1 şeklindedir.
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };


    ///////////////////

    //image silme fonk.
    const deleteImage = async () => {
      const currentUser = await users.getCurrentUser();  // Asenkron işlemi bekle
      if (!currentUser) return;
    
      try {
        await removeImage(currentUser.id, Todo.id); // Önce resmi kaldır
    
        const updatedTodoList = await getTodoList(currentUser.id); // Güncellenmiş veriyi çek
        setTodoListState(updatedTodoList); // Yeni todo listesini state'e ata
        console.log("Güncellenmiş Todo Listesi:", updatedTodoList);
    
        const newTodo = updatedTodoList.find(item => item.id === Todo.id); // Yeni todoyu bul
        console.log("Güncellenmiş Todo:", newTodo);
    
        setTodo(newTodo || {}); // Güncellenmiş todo'yu state'e ata, yoksa boş nesne ata
        setImage(null); // Resmi kaldır
    
        console.log("Resim silindi ve todo güncellendi!");
      } catch (error) {
        console.error("Resim silme hatası:", error);
      }
    };
    
    
  return (
      <TouchableOpacity onPress={slideDown} style={styles.backdrop}>
        <Pressable style={{ width: '100%', height: '90%' }}>
         <View style={{
                   backgroundColor: '#F79E89',
                    height: Dimensions.get('window').height,
                    borderTopRightRadius: 20, 
                    borderTopLeftRadius: 20,}}>

          <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
          >

          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>

              <View style={{alignItems:"center", justifyContent:"center"}}>
                  <TouchableOpacity onPress={slideDown}
                  style={{
                      borderWidth: 3,
                      borderColor: "white",
                      width: "40%",
                      borderRadius: 50
                      
                    }}></TouchableOpacity>
              </View>

              <ScrollView  contentContainerStyle={{ flexGrow: 1, paddingBottom: 50, paddingHorizontal: 15 }}
               keyboardShouldPersistTaps="handled"
               showsVerticalScrollIndicator={false}
               keyboardDismissMode="on-drag"  // Scroll yaparken klavye kapanmasını sağlar
              >

                <TextInput 
                placeholder="Title" 
                value={head} 
                onChangeText={setHead} 
                style={[styles.input, { height: 45 }]} 
                />

                <TextInput
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.input, { height: image || Todo.imageUrl ? 280 : 350, textAlignVertical: "top" }]}
                  multiline
                />
                <View style={styles.calendarContainer}>
                    <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                      <TextInput
                          placeholder="Deadline (Optional)"
                          value={deadline}
                          editable={false}
                          style={{justifyContent:'center',alignItems:"center", color:"white", fontSize:16}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.calendarIcon} onPress={showDatePicker}>
                       <Icon name="calendar" size={26} color="#000"  />
                    </TouchableOpacity>
              
                </View>

                <View style={styles.calendarContainer}>
                      {image|| Todo.imageUrl? (
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '300' }}>
                      <Image
                      resizeMode='cover'
                        source={{ uri: image? image : Todo.imageUrl }}
                        style={{ width: 200, height: 150, marginTop: 10 }}
                      />
                      <View>
                        <TouchableOpacity style={{ marginLeft: 40 }} onPress={pickImage}>
                          <Icon name="image" size={26} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginLeft: 40 }} onPress={deleteImage}>
                        <Icon2 name="delete" size={32} color="#000" style={{ marginTop: 20 }} />
                        </TouchableOpacity>
                      </View>
                      
                    </View>
                      
                      ) : (
                        <>
                          {/* Resim eklemek için kullanıcıya alan sunan TextInput */}
                          <TouchableOpacity onPress={pickImage} style={styles.input}>
                            <TextInput
                              placeholder="Add Image (Optional)"
                              editable={false}
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: 16,
                              }}
                            />
                          </TouchableOpacity>
                          {/* Resim seçme ikonu */}
                          <TouchableOpacity style={styles.calendarIcon} onPress={pickImage}>
                            <Icon name="image" size={26} color="#000" />
                          </TouchableOpacity>
                        </>
                      )}
                </View>           

                {isDatePickerVisible && (
                  <Modal
                    transparent={true}
                    animationType="fade"
                    visible={isDatePickerVisible}
                  >
                    <View style={styles.overlay}>
                      <View style={{justifyContent:"center", alignItems:"center", flexDirection:'column'}}>
                        <DatePicker
                          value= {newDate}
                          mode="date"
                          display={Platform.OS === "ios" ? "spinner" : "calendar"}
                          style={styles.datePicker}
                          
                          onChange={(event, selectedDate) => {

                            if (selectedDate) {
                              setDeadline(selectedDate.toLocaleDateString());
                            } else{
                              setDeadline(newDate);
                            }
                            if(Platform.OS==="android"){
                              setDatePickerVisibility(false);
                            }
                           
                          }}
                        />
                         {/* iOS için "Kapat" butonu */}
                        {Platform.OS === "ios" && (
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {

                                setDatePickerVisibility(false)
                              }
                             
                             
                            }
                          >
                            <Text style={styles.closeButtonText}>Kapat</Text>
                          </TouchableOpacity>
                        )}
                      
                      </View>
                    </View>
                  </Modal>
                )}
               


               

                

                <View style={styles.radioButtonContainer}>
                      <TouchableOpacity 
                        style={[styles.radioButton, category === "Kariyer" ]}
                        onPress={() => setCategory("Kariyer")}
                      >
                        <View style={[styles.circle, category === "Kariyer" && styles.circleSelected]}>
                          {category === "Kariyer" && <View style={styles.innerCircle} />}
                        </View>
                        <Text style={[styles.radioText, category === "Kariyer" && styles.radioTextSelected]}>Kariyer</Text>
                      </TouchableOpacity>

                      {/* Eğlence Seçeneği */}
                      <TouchableOpacity 
                        style={[styles.radioButton, category === "Eğlence"]}
                        onPress={() => setCategory("Eğlence")}
                      >
                        <View style={[styles.circle, category === "Eğlence" && styles.circleSelected]}>
                          {category === "Eğlence" && <View style={styles.innerCircle} />}
                        </View>
                        <Text style={[styles.radioText, category === "Eğlence" && styles.radioTextSelected]}>Eğlence</Text>
                      </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={editFunction} style={styles.saveButton}>
                  <Text style={{ textAlign: "center", color: "#F79E89" }}>UPDATE TODO</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
            </KeyboardAvoidingView>
          </View>
        </Pressable>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#F79E89',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    height: Dimensions.get('window').height,
  },
  input: {
    width: '100%',
    marginBottom: 5,
    fontSize: 16,
    height:40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
    marginTop: 15,
    color: "white",
    paddingHorizontal: 10,
    justifyContent:"center",
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  calendarIcon: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 8,
    borderColor: 'white',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "red", 
    alignSelf:'center',
    top:2,
    alignItems:'center',
  },
  radioButtonSelected: {
    borderColor: 'white',
  },
  radioText: {
    fontSize: 16,
  },
  radioTextSelected: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    height:50,
    width: "100%",
    marginTop: 20,
    alignItems:"center",
    justifyContent:"center"
  },

  datePicker: {
    backgroundColor: 'rgba(176,224,230,0.5)', 
    borderRadius: 10,
    height: 250,
    justifyContent: 'center', // İçeriği ortalamak için
    alignItems: 'center', // İçeriği yatayda ortalamak için
  },
  closeButton: {
    marginTop:10,
    backgroundColor: "#FF6347",  // Tomat renk
    padding: 10,
    borderRadius: 5,
    width: '200',  // Butonun tam genişlikte olması
    borderRadius: 10
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },


});
