import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { auth, realtimeDb } from '../firebase/firebaseConfig';
import { ref, onValue, push } from 'firebase/database';

export default function ChatScreen({ route }) {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const chatRoomId = [auth.currentUser.uid, user.id].sort().join('_');

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats/${chatRoomId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const messagesRef = ref(realtimeDb, `chats/${chatRoomId}`);
    push(messagesRef, {
      text: messageText,
      senderId: auth.currentUser.uid,
      timestamp: Date.now(),
    });

    setMessageText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text
                style={[
                  styles.message,
                  item.senderId === auth.currentUser.uid
                    ? styles.sentMessage
                    : styles.receivedMessage,
                ]}
              >
                {item.text}
              </Text>
            )}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={sendMessage} // To handle Enter key
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    maxWidth: '70%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
