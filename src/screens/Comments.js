import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let userId = '';
let comments = [];
let postId = '';
let name=''
let profilePic=''

const Comments = () => {
  const route = useRoute();
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    getUserId();
    comments = route.params.comments;
    setCommentList(comments);

    postId = route.params.postId;
  }, []);
  const getUserId = async () => {
    userId = await AsyncStorage.getItem('userId');
    name=await AsyncStorage.getItem('name')
    profilePic=await AsyncStorage.getItem("profilePic")

  };
  const postComment = () => {
    let tempComments = comments;
    tempComments.push({userId: userId, comment: comment, postId: postId, name: name,
      profilePic:profilePic});
    firestore()
      .collection('Posts')
      .doc(postId)
      .update({
        comments: tempComments,
      })
      .then(() => {
        console.log('Post updated!');
        getNewComment()
      });
    inputRef.current.clear();
  };
  const getNewComment=()=>{
    firestore()
      .collection('Posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        setCommentList(documentSnapshot.data().comments)
        
      });

  }
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.txt}>Comments</Text>
      </View>
      <FlatList
        data={commentList}
        renderItem={({index, item}) => {
          return (
            <View style={styles.commentbox}>
              {
                item.profilePic == '' ?(
                  <Image
                source={require('../Images/userP.png')}
                style={{height: 40, width: 40, marginLeft: 10, marginRight: 15, borderRadius:20 }}
              />
                ):(
                  <Image
                source={{uri: item.profilePic}}
                style={{height: 40, width: 40, marginLeft: 10, marginRight: 15, borderRadius:20}}
              />
                )
              }
              <View>
                <Text style={{fontSize: 18, fontWeight: '600'}}>
                {item.name}
              </Text>
              <Text style={{fontSize: 14, fontWeight: '600',marginTop:5}}>
                {item.comment}
              </Text>
              </View>
              
            </View>
          );
        }}
      />
      <View style={styles.inputView}>
        <TextInput
          ref={inputRef}
          placeholder="Type Comment Here"
          style={styles.input}
          value={comment}
          onChangeText={text => setComment(text)}
        />
        <Text
          style={styles.press}
          onPress={() => {
            postComment();
          }}>
          Send
        </Text>
      </View>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    marginLeft: 20,
    fontSize: 17,
    fontWeight: '600',
  },
  inputView: {
    width: '100%',
    height: 60,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  press: {
    color: 'dodgerblue',
    fontWeight: '600',
    fontSize: 18,
    marginRight: 20,
  },
  input: {
    marginLeft: 20,
    width: '80%',
  },
  commentbox: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
