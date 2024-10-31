import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const NewMessages = () => {
  const [messages, setMessages] = useState([]);
  const[imageDate,setImageData]=useState(null)
  const[imageUrl,setImageUrl]=useState("")
  const route = useRoute();

  useEffect(() => {
    const querSnapshow = firestore()
      .collection('chats')
      .doc('12345678')
      .collection('messages')
      .orderBy('createdAt', 'desc');
    querSnapshow.onSnapshot(snapShot => {
      const allMessages = snapShot.docs.map(snap => {
        return {...snap.data(), createdAt: new Date()};
      });
      setMessages(allMessages);
    });
  }, []);


  //Image for Gallery Open

  const opeGallery=async()=>{
    const result= await launchImageLibrary({mediaType:"photo"})
    console.log(result)
    if(result.didCancel && result.didCancel == true){
    } else{
      setImageData(result)
      uploadImage(result)

    }

  }

  const uploadImage=async()=>{
    const reference=storage().ref(imageDate.assets[0].fileName)
    const pathFile=imageDate.assets[0].uri
    await reference.putFile(pathFile)
    const url=await storage().ref(imageDate.assets[0].fileName).getDownloadURL()
    setImageUrl(url)
    
  }


  const onSend = messageArray => {
    console.log(messageArray);
    let mymsg=null
    
    if(imageUrl !==""){
      const msg = messageArray[0];
      mymsg = {
        ...msg,
        sender: route.params.id,
        reciever: route.params.data.userId,
        image:imageUrl
      };

    }else{
      const msg = messageArray[0];
      mymsg = {
        ...msg,
        sender: route.params.id,
        reciever: route.params.data.userId,
        image:" "
      };

    }
   
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    firestore()
      .collection('chats')
      .doc('12345678')
      .collection('messages')
      .add({
        ...mymsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white  '}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
        alwaysShowSend
        renderSend={props => {
          return (
            <View
              style={{flexDirection: 'row', height: 60, alignItems: 'center'}}>
             {
              imageUrl !=="" ?(
                <View
                style={{
                  height:40,width:40,borderRadius:10,backgroundColor:"white",
                  marginRight:10
                }}
                >
                  <Image source={{uri:imageDate.assets[0].uri}}
                  style={{height:40,width:40,borderRadius:10,position:"absolute"}}/>
                  <TouchableOpacity onPress={()=>{setImageUrl("")}}>
                    <Image source={require("../Images/close.png")} style={{
                      width:16,height:16,tintColor:"white"
                    }}/>

                  </TouchableOpacity>
                </View>
              ):null
             }

              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  Alert.alert('Attach Clicked');
                }}>
                <Image
                  source={require('../Images/attach.png')}
                  style={{height: 20, width: 20, tintColor: 'dodgerblue'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  Alert.alert('MiC Clicked');
                }}>
                <Image
                  source={require('../Images/mic.png')}
                  style={{height: 20, width: 20, tintColor: 'dodgerblue'}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 5}} onPress={()=>{opeGallery()}}>
                <Image
                  source={require('../Images/gallery.png')}
                  style={{height: 24, width: 24, tintColor: 'dodgerblue'}}
                />
              </TouchableOpacity>

              <Send
                {...props}
                containerStyle={{justifyContent: 'center', marginLeft: 15}}>
                <Image
                  source={require('../Images/send.png')}
                  style={{
                    height: 24,
                    width: 24,
                    marginRight: 20,
                    tintColor: 'dodgerblue',
                  }}
                />
              </Send>
            </View>
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                borderWidth: 0.3,
                borderRadius: 30,
                marginBottom: 5,
                marginLeft: 5,
                marginRight: 5,
                elevation: 8,
                alignItems: 'center',
              }}></InputToolbar>
          );
        }}
      />
    </View>
  );
};

export default NewMessages;

const styles = StyleSheet.create({});
