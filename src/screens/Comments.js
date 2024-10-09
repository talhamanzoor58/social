import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let userId = '';
let comments=[]
let postId=''

const Comments = () => {
  const route=useRoute()
  const [comment, setComment] = useState('');
  const[commentList,setCommentList]=useState([])
  const inputRef=useRef()

  useEffect(() => {
    getUserId();
    comments=route.params.comments
    setCommentList(comments)
   
    postId=route.params.postId
  }, []);
  const getUserId = async () => {
    userId = await AsyncStorage.getItem('userId');
  };
  const postComment = () => {
    let tempComments=comments
    tempComments.push({userId:userId,comment:comment,postId:postId})
    firestore()
      .collection('Posts')
      .doc(postId)
      .update({
       comments: tempComments,
      })
      .then(() => {
        console.log('Post updated!');
      });
      inputRef.current.clear()
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.txt}>Comments</Text>
      </View>
      <FlatList
      data={commentList}
      renderItem={({index,item})=>{
        return(
            <View style={styles.commentbox}>
                <Image source={require("../Images/userP.png")} style={{height:40,width:40,marginLeft:10,marginRight:15}}/>
                <Text style={{fontSize:16,fontWeight:"600"}}>{item.comment}</Text>

            </View>
        )
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
        <Text style={styles.press} onPress={()=>{postComment()}}>Send</Text>
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
  commentbox:{
    height:50,
    width:"100%",
    flexDirection:"row",
    alignItems:"center"
  }
});
