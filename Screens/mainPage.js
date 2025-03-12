import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal, BackHandler, Alert, Platform } from 'react-native';
import { TodoModel, getTodoList } from '../models/todoModel'; // Import TodoModel and getTodoList
import AddTodo from './addTodo';
import CountdownTimer from './countTimeTimer';
import { users } from '../models/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome'

export default function MainPage({ navigation }) {
  const [tasks, setTasks] = useState([]); // todolist
  const [filteredTasks, setFilteredTasks] = useState([]); // Filtreleme için todoList durumunu kontrol ediyor
  const [addTodoModalVisible, setAddTodoModalVisible] = useState(false); // AddTodo Modalının görünürlüğü
  const [timerModalVisible, setTimerModalVisible] = useState(false); // Timer Modalının görünürlüğü
  const [selectedTodo, setSelectedTodo] = useState(null); // timera parametre gönderilmesi için selectedTodo kontrolü.
  const [isFilterVisible, setIsFilterVisible] = useState(false); // filtrenin görünürlüğü
  const [selectedCategory, setSelectedCategory] = useState(""); // seçilen kategorinin kontrol eidlmesi.
  const [noTasksMessage, setNoTasksMessage] = useState(""); // Görev yok mesajı için state
  

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

      Alert.alert('', 'Çıkış yapmak istiyor musunuz?', [
        { text: 'Hayır', onPress: () => null, style: 'cancel' },
        { text: 'Evet', color:"green",onPress: () =>{
          const currentUser = users.getCurrentUser();
           AsyncStorage.setItem('userSession', JSON.stringify({ isLoggedIn: false, userId: currentUser.id }));
          navigation.navigate("Login")
        }  }, 
      ]);
      return true; 
    });
    // bu sürekli bellekte yer edinmesin diye gerekli bir fonk.
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
      const fetchTasks = async () => {
        const currentUser = await users.getCurrentUser();
        const todoList = await getTodoList(currentUser.id); // kullanıcıya ait todo listeleri al
        setTasks(todoList); // task'ı güncelle
         // Eğer tasks dizisi boşsa, genel bir mesaj göster
        if (tasks.length === 0) {
          setNoTasksMessage("Henüz herhangi bir todo eklenmemiş.");
        }
      };
      fetchTasks();

  }, [addTodoModalVisible]); 
  //Not: sonsuz döngüyü kırmak adına add Todo görünür yaptıysa veya kapattıysa sadece yenilesin. 
  // Tasks değiştiğinde çalışırsa içeride sürekli aynı da olsa set edilen bir setTasks methodu var. 
  // setTask içeride taskın yenilendiğini bildiriyor. Bu da sonsuz döngüye sebep oluyor.
  
  
//////////////////////////////////////////////

  // Filterleme ve boş görev kontrolü
useEffect(() => {

  if (selectedCategory) {
    // Seçilen kategori ile eşleşen görevleri getir
    const filtered = tasks.filter(task => task.category === selectedCategory); 
    setFilteredTasks(filtered);

    if (filtered.length === 0) {
      setNoTasksMessage("Bu kategoride hiçbir todo bulunmamaktadır.");
    } else {
      setNoTasksMessage(""); // Kategoriye uygun görev varsa mesajı temizle
    }
  } else {
    setFilteredTasks(tasks); // Kategori seçilmemişse tüm görevleri geri getir
    setNoTasksMessage(""); // Tüm görevler gösteriliyorsa mesajı temizle
  }

  // Eğer tasks dizisi boşsa, genel bir mesaj göster
  if (tasks.length === 0) {
    setNoTasksMessage("Henüz herhangi bir todo eklenmemiş.");
  }

}, [tasks, selectedCategory]); // tasks veya selectedCategory değişirse çalışır

  // category filtresi için 
  const filterTasksByCategory = (category) => {
    setSelectedCategory(category); 
    setIsFilterVisible(false); 
  };

  /////////////////////////

  // navigasyon fonk.
  const cardNavigation = (todo) => {
    navigation.navigate("Details", { id: todo.id });
  };

  const profileNavigation = () => {
    navigation.navigate("Profile");
  };

  /////////////////////////////
  // timer fonk.
  const showTimerModal = (todo) => {
    setSelectedTodo(todo);
  };

  const closeTimerModal = () => {
    setTimerModalVisible(false);
    setSelectedTodo(null);
  };


  
  useEffect(() => {
    if (selectedTodo) {
      setTimerModalVisible(true);
    }
  }, [selectedTodo]);



  
  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.textStyle}>TO DO LIST</Text>
        <TouchableOpacity onPress={profileNavigation}>
        <Icon name="settings" size={28} color="#4e4e4e"/>
        </TouchableOpacity>
      </View>

      <View style={[styles.headContainer, { marginTop: 10 }]}>
        <View style={styles.headContainer2}>
          <Image source={require("../assets/icons/Union.png")} style={{ width: 24, height: 24, marginRight: 10 }} />
          <Text style={styles.textStyle}>LIST OF TODO</Text>
        </View>
        <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)}>
          <Image source={require("../assets/icons/filter.png")} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {isFilterVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.filterOption} onPress={() => filterTasksByCategory("Kariyer")}>
            <Text style={styles.filterText}>Kariyer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => filterTasksByCategory("Eğlence")}>
            <Text style={styles.filterText}>Eğlence</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => filterTasksByCategory("")}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
        </View>
      )}

      
      {noTasksMessage ? (
        <View style= {{justifyContent:"center",
          alignItems:"center",height:"80%",}}>
        <Text
          style={{
            color: "grey",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center", // metni ortalamak için
          }}
          >
            {noTasksMessage} {/* Mesajımız */}
          </Text>
          </View>
        ) : (
              <ScrollView style={styles.scrollContainer}>
                {filteredTasks.map((todo, index) => {
                  // Tarih formatlarını kontrol etme ve dönüştürme
                  let deadlineDate, createdAtDate;

                  try {

                    if(Platform.OS==="android"){
                      deadlineDate = todo.deadLine.split(".").reverse().join("-");
                      createdAtDate = todo.createdAt.split(".").reverse().join("-"); 
                      }
                      else{
                        const [month2,day2 , year2] = todo.deadLine.split("/"); 
                        if(month2<10){
                          deadlineDate = `${year2}-${0}${month2}-${day2}`;
                        }
                        else{
                          deadlineDate = `${year2}-${month2}-${day2}`;
                        }
                       
                        createdAtDate = todo.createdAt.split(".").reverse().join("-");
                      }
                    // Geçerli tarih formatlarına dönüştürme
                    
                  } catch (error) {
                    console.error("Tarih formatı hatası:", error);
                    deadlineDate = new Date();  // Varsayılan tarih
                    createdAtDate = new Date();  // Varsayılan tarih
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.cards,
                        deadlineDate <= createdAtDate
                          ? { backgroundColor: "#F79E89" }
                          : { backgroundColor: "#F76C6A" },
                      ]}
                      onPress={() => cardNavigation(todo)}
                    >
                      <View style={styles.titleContainer}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                          {todo.title}
                        </Text>
                        <TouchableOpacity onPress={() => showTimerModal(todo)}>
                          <Image
                            source={require("../assets/icons/clock.png")}
                            style={{ width: 25, height: 25 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text numberOfLines={7} ellipsizeMode="tail" style={styles.description}>
                        {todo.description}
                      </Text>
                      <View style={styles.categoryContainer}>
                        <Text style={{ fontSize: 12, color: "white" }}>
                          Created at: {todo.createdAt}
                        </Text>
                        {todo.category === "Kariyer" ? (
                          <Icon2 name="briefcase" size={24} color="black" />
                        ) : (
                          <Icon2 name="star" size={24} color="yellow" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
                      )}

      <TouchableOpacity onPress={() => setAddTodoModalVisible(true)}>
        <Image source={require("../assets/icons/plus-circle.png")} style={{ width: 75, height: 75, position: "absolute", bottom: 10, right: 10 }} />
      </TouchableOpacity>

      {/* AddTodo Modal */}
      {addTodoModalVisible && <AddTodo modalVisible={addTodoModalVisible} setModalVisible={setAddTodoModalVisible} />}

      {/* Timer Modal */}
      <Modal visible={timerModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTodo && (
              <CountdownTimer 
              createdAt={selectedTodo.createdAt} 
              deadline={selectedTodo.deadLine}
              />
            )}
            <TouchableOpacity onPress={closeTimerModal}>
              <Text style={styles.closeButton}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingTop:10
  },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    marginTop: 40,
  },
  headContainer2: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F79E89",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    height: "80%",
  },
  cards: {
    backgroundColor:  "#F76C6A",
    borderRadius: 20,
    marginBottom: 15,
    padding: 10,
    height: 180,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    width:300
  },
  description: {
    fontSize: 13,
    color: "white",
  },
  categoryContainer: {
    position: "absolute",  // Mutlaka kartın içinde konumlanmasını sağlar.
    bottom: 0,             // Her zaman kartın en altına yapıştırır.
    left: 0,               // Opsiyonel: Kartın sol kenarına yaslar.
    right: 0,              // Opsiyonel: Kartın sağ kenarına yaslar.
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",  // Daha düzgün hizalama için "center" kullanabilirsiniz.
    padding: 10,   
 
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 13,
    width: "80%",
    position: "absolute",
    zIndex: 10,
    bottom: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    fontSize: 18,
    color: "#F79E89",
  },
  dropdownMenu: {
    position: "absolute",
    top: 100,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: 150,
    elevation: 5,
    zIndex: 1000,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  filterText: {
    fontSize: 16,
    color: "#F79E89",
  },
});
