import { Image, StyleSheet, TouchableOpacity, View, Text, Alert, Modal } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import EditTodo from "./editTodo";
import { removeTodo, getTodoList } from '../models/todoModel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/FontAwesome'
import { users } from '../models/users'; 

export default function Details({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [todoListState, setTodoListState] = useState([]);
  const [userId, setUserId] = useState(null);  

  // userId yi en başta set ediyoruz.
  useEffect(() => {
    const fetchUserId = async () => {
      const currentUser = await users.getCurrentUser();
      setUserId(currentUser.id); 
    };

    fetchUserId();
  }, []);  

  useEffect(() => {
    if (userId !== null) { 
      const fetchTodoList = async () => {
        const todoList = await getTodoList(userId); 
        setTodoListState(todoList);
      };

      fetchTodoList();
    }
  }, [userId]);  

  const route = useRoute();
  const { id } = route.params;
  const todo = todoListState && todoListState.find(item => item.id === id);

  if (!todo) {
    return <Text>Todo not found!</Text>;
  }

  const backPageNavigation = () => {
    navigation.navigate("MainPage");
  };

  const confirmDelete = async () => {
    try {

      await removeTodo(userId, todo.id); 

      // Update the todo list in state
      const updatedTodoList = todoListState.filter(item => item.id !== todo.id);
      setTodoListState(updatedTodoList);

      setDeleteModalVisible(false);
      Alert.alert("Success", "Todo başarılı bir şekilde silindi.");

      navigation.navigate("MainPage");
    } catch (error) {
      console.error("Error deleting todo:", error);
      Alert.alert("Error", "There was an issue deleting the todo");
    }
  };

  return (
    <View>
      <View style={styles.headContainer}>
        <TouchableOpacity onPress={backPageNavigation}>
        <Icon name="arrow-back-ios" size={24}  style={{marginLeft:10, padding:5}} color="#000"  />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon2 name="edit-3" size={26} style={{padding:5}} color="#000"  />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
            <Icon2 name="trash-2" size={26} style={{marginHorizontal:15 ,padding:5}}  color="#000"  />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: "90%", marginLeft: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 26 }}>{todo.title}</Text>
        <Text style={{ fontSize: 16 }}>{todo.description}</Text>
        {todo.imageUrl && <Image source={{ uri: todo.imageUrl }} style={{width:300, height:300, marginTop:20}} />}
        
        <View style={styles.categoryContainer}>
            <Text style={{fontSize: 12, color: "black",}}>Deadline: {todo.deadLine}</Text>
            {todo.category === "Kariyer"? (
            <Icon3 name = "briefcase" size = {24} color = "black"/>
            ):
            (
            <Icon3 name ="star" size = {30} color= "#ffdf00"/>              
            )}
        </View>
      </View>

      {modalVisible && (
        <EditTodo modalVisible={modalVisible} setModalVisible={setModalVisible} todo={todo} />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Text style={{ color: "#F76C6A", fontWeight: "bold", fontSize: 14 }}>Delete TODO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
            <Text style={{ color: "#00FF19", opacity: 0.5, fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    marginTop: 40,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  categoryContainer: {
    position: "absolute",  // Mutlaka kartın içinde konumlanmasını sağlar.
    bottom: 50,             // Her zaman kartın en altına yapıştırır.
    left: 0,               // Opsiyonel: Kartın sol kenarına yaslar.
    right: 10,              // Opsiyonel: Kartın sağ kenarına yaslar.
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",  // Daha düzgün hizalama için "center" kullanabilirsiniz.
    padding: 10,   
 
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cancelButton: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 5,
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "red",
    fontWeight: "bold",
  },
});
