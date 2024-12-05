import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ChatListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      // Ensure user is authenticated before making Firestore queries
      if (!auth.currentUser) {
        alert('Please log in to access this page.');
        return;
      }
  
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.email !== auth.currentUser.email); // Don't include the current user in the list
        setUsers(userList);
      } catch (error) {
        alert('Error fetching users: ' + error.message);
      }
    };
  
    fetchUsers();
  }, []);
  
  

  const openChat = (user) => {
    navigation.navigate('Chat', { user });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to Login screen after sign out
      navigation.replace('Login');
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with Users</Text>
      
      {/* Logout Button */}
      <Button title="Log Out" onPress={handleLogout} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => openChat(item)}
          >
            <Text style={styles.userName}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  userName: { fontSize: 18 },
});
