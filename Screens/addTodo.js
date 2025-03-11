import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Animated, ScrollView, Pressable, Platform, Keyboard, Alert, TouchableWithoutFeedback, Dimensions, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { users } from '../models/users'; 
import DatePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TodoModel } from '../models/todoModel';
import React from 'react';

export default function AddTodo({ modalVisible, setModalVisible }) {
  const [head, setHead] = useState("");
  const [description, setDescription] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
  const [deadline, setDeadline] = useState(newDate.toLocaleDateString());
  
  // bir kez userId yi alıyoruz
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await users.getCurrentUser();
      if (currentUser) {
        setUserId(currentUser.id);
      }
    };
    fetchUser();
  }, []); 

  // datePicker görünür olup olmayacağı ile ilgili fonk.
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

 

  const handleAddTodo = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    if (head.trim() === "" || !category || category.trim() === "" || description.trim() === "" || !deadline) {
      Alert.alert("Hata", "Tüm alanları doldurmalısınız.a",[{text:"Tamam"}]);
      
      return;
    }

    const createdAt = new Date().toLocaleDateString('tr-TR');
    // todoId y uniq olarak atıyoruz
    const todoId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newTodo = new TodoModel(userId, todoId, head, description, createdAt, deadline, category);

    try {
      await newTodo.addTodo(userId, newTodo); 
      setModalVisible(false);
    } catch (error) {
      console.error("Hata oluştu: ", error);
    }
  };

  const slide = React.useRef(new Animated.Value(500)).current;
  
  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };
  
  const slideDown = () => {
    Animated.timing(slide, {
      toValue: 500,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    slideUp();
  }, []);

  const closeModal = () => {
    slideDown();
    setTimeout(() => {
      setModalVisible(false);
    }, 600);
  };

  return (
    <TouchableOpacity onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{ width: '100%', height: '87%' }}>
        <View style={{backgroundColor: '#F79E89', height: Dimensions.get('window').height,borderTopRightRadius: 20, borderTopLeftRadius: 20,}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
            <View style={{alignItems:"center", justifyContent:"center"}}>
              <TouchableOpacity onPress={closeModal}
              style={{
                  borderWidth: 3,
                  borderColor: "white",
                  width: "40%",
                  borderRadius: 50
                  
                }}></TouchableOpacity>
              </View>
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingHorizontal: 15 }}
              keyboardShouldPersistTaps="always" // Tıklamalarla klavye kapanmasını sağlar
              keyboardDismissMode="on-drag"  // Scroll yaparken klavye kapanmasını sağlar
              showsVerticalScrollIndicator={false} // aşağı kayan çubuğun kaybolmasını sağlar.
            >

              <TextInput
                placeholder="Title"
                value={head}
                onChangeText={text => setHead(text)}
                style={[styles.TextInput, { height: 45 }]}
              />
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={text => setDescription(text)}
                style={[styles.TextInput, { height: 400, textAlignVertical: "top" }]}
                multiline
              />

              <View style={styles.calendarContainer}>
              <TouchableOpacity onPress={showDatePicker} style={styles.TextInput}>
                <TextInput
                    placeholder="Deadline (Optional)"
                    value={deadline}
                    editable={false}
                    style={{justifyContent:'center',alignItems:"center", color:"white", fontSize:16}}
                  />
              </TouchableOpacity>
              <Icon name="calendar" size={26} color="#000" style={styles.calendarIcon} />
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

              <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
              <Text style={{ textAlign: "center", color: "#F79E89" }}>ADD TODO</Text>
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
    maxHeight: Dimensions.get('window').height 
  },
  TextInput: {
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  addButton: {
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
