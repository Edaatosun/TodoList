import AsyncStorage from "@react-native-async-storage/async-storage";

export class TodoModel {
  constructor(userId, id, title, description, createdAt, deadLine, category,imageUrl) {
    this.userId = userId; // Her kullanıcıya ait farklı todo listesi olacak o yüzden userId kullanıyoruz.
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.deadLine = deadLine;
    this.category = category; 
    this.imageUrl = imageUrl;
  }

  // Kullanıcıya özel Todo ekliyoruz.
  async addTodo(userId, newTodo) {
    try {
      // todoList_(userId) adındaki listeyi alıyoruz.
      //  burada userId nin uniq olması sebebiyle kişilere ait todo listeleri gelir.
      let todoList = JSON.parse(await AsyncStorage.getItem(`todoList_${userId}`)) || [];

      // Yeni todo'yu listeye ekle
      todoList.push(newTodo);

      // Güncellenmiş todo listesini AsyncStorage'a kaydediyoruz.
      await AsyncStorage.setItem(`todoList_${userId}`, JSON.stringify(todoList));
      return todoList;
    } catch (error) {
      console.error("Todo eklerken hata oluştu: ", error);
    }
  }

  static async updateTodo(userId, id, newTitle, newDescription, newDeadLine, newCategory,imageUrl) {
    try {
      // Kullanıcıya özel todo listesini AsyncStorage'tan alıyoruz yine. 
      //Eğer bulamazsa boş dizi döndürür.
      let todoList = JSON.parse(await AsyncStorage.getItem(`todoList_${userId}`)) || [];

      // Güncellenmesi gereken todo'yu buluyoruz todonun kendi id si ile
      const todo = todoList.find(todo => todo.id === id);
      if (todo) {
        todo.title = newTitle;
        todo.description = newDescription;
        todo.deadLine = newDeadLine;
        todo.category = newCategory;
        todo.imageUrl = imageUrl

        // Güncellenmiş todo listesini AsyncStorage'a kaydet
        await AsyncStorage.setItem(`todoList_${userId}`, JSON.stringify(todoList));
      }
    } catch (error) {
      console.error("Todo güncellenirken hata oluştu: ", error);
    }
  }


  
}

// Kullanıcıya özel Todo listesini  almak için userId ile filtreliyoruz.
export async function getTodoList(userId) {
  try {
    const todoList = await AsyncStorage.getItem(`todoList_${userId}`);
    return JSON.parse(todoList) || [];
  } catch (error) {
    console.error("Todo listesi alınırken hata oluştu: ", error);
    return [];
  }
};


// Kullanıcıya özel Todo silme
export const removeTodo = async (userId, todoId) => {
  try {
    // burada userId ye ait todolisti zaten getTodoList fonk ile alabiliyoruz.
    const todoList = await getTodoList(userId);
    // todoid ile filtreleyerek todolisti buluyoruz.
    const updatedTodoList = todoList.filter(item => item.id !== todoId);
    await AsyncStorage.setItem(`todoList_${userId}`, JSON.stringify(updatedTodoList));
  } catch (error) {
    console.error(error);
  }
};

export const removeImage = async (userId, todoId) => {
  try {
    let todoList = JSON.parse(await AsyncStorage.getItem(`todoList_${userId}`)) || [];
    console.log("kırmızıııııııııııııııııı")
    
    let updatedList = todoList.map(todo => {
      if (todo.id === todoId) {
        console.log("yeşillllllllllllllllllllllllllll")
        return { ...todo, imageUrl: "" };  // Resmi kaldırıyoruz(
        console.log(todo.imageUrl);
      }
      return todo;
    });

    await AsyncStorage.setItem(`todoList_${userId}`, JSON.stringify(updatedList));
    console.log("Resim başarıyla silindi!");
  } catch (error) {
    console.error("Resim silinirken hata oluştu:", error);
  }
};


