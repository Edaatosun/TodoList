import { View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Animated, Pressable,Modal } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import DatePicker from '@react-native-community/datetimepicker';
import { TodoModel } from '../models/todoModel';
import { useNavigation } from '@react-navigation/native';
import { users } from '../models/users';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EditTodo({ modalVisible, setModalVisible, todo }) {
  const navigation = useNavigation();
  const [head, setHead] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [deadline, setDeadline] = useState(todo?.deadLine || "");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [category, setCategory] = useState(todo?.category || "");

  const slide = useRef(new Animated.Value(300)).current;

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
    }).start(() => setModalVisible(false));
  };


  const editFunction = async () => {
    const currentUser = await users.getCurrentUser();
    if (!currentUser) return;

    const todoModel = new TodoModel(
      currentUser.id, 
      todo.id, 
      head, 
      description, 
      todo.createdAt, 
      deadline, 
      category
    );

    try {
      await todoModel.updateTodo(currentUser.id, todo.id, head, description, deadline, category);
      navigation.navigate("MainPage");
      setModalVisible(false);
    } catch (error) {
      console.error("Hata oluştu: ", error);
    }
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <Pressable onPress={slideDown} style={styles.backdrop}>
        <Pressable style={{ width: '100%', height: '90%' }}>
         <View style={{backgroundColor: '#F79E89', height:720 ,borderTopRightRadius: 20, borderTopLeftRadius: 20,}}>
        
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
            <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

              <View style={{alignItems:"center", justifyContent:"center"}}>
                  <View style={{
                        borderWidth: 3,
                        borderColor: "white",
                        width: "40%",
                         borderRadius: 50}}>
                  </View>
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
                  style={[styles.input, { height: 400, textAlignVertical: "top" }]}
                  multiline
                />
                <View style={styles.calendarContainer}>
                  <TextInput 
                  placeholder="Deadline (Optional)" 
                  value={deadline} 
                  style={styles.input} 
                  editable={false} 
                  />

                  <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.calendarIcon}>
                    <Icon name="calendar" size={30} color="#000" />
                  </TouchableOpacity>

                </View>

       
                {isDatePickerVisible && (
                  <Modal
                    transparent={true}
                    animationType="fade"
                    visible={isDatePickerVisible}
                    onRequestClose={() => setDatePickerVisibility(false)}
                  >
                    <View style={styles.overlay}>
                      <View style={{justifyContent:"center", alignItems:"center"}}>
                        <DatePicker
                          value={new Date()}
                          mode="date"
                          display={Platform.OS === "ios" ? "spinner" : "calendar"}
                          style={styles.datePicker}
                          onChange={(event, selectedDate) => {
                            if (selectedDate) {
                              setDeadline(selectedDate.toLocaleDateString());
                            }
                            setDatePickerVisibility(false);
                          }}
                        />
                      
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
            </KeyboardAvoidingView>
          </Animated.View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
    height: '100%',
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
    top: 18,
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
    backgroundColor: 'white', 
    borderRadius: 10,
    height: 250,
    justifyContent: 'center', // İçeriği ortalamak için
    alignItems: 'center', // İçeriği yatayda ortalamak için
  }

});
