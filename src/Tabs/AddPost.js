import { Image, StyleSheet, Text, TouchableOpacity, View,TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

let token="";
let name="";
let email="";
const AddPost = () => {
  const[imagedata,setImageData]=useState(null)
  const[captions,setCaptions]=useState(null)


  //for token
  useEffect(()=>{
    getFCMToken()
  },[])

  const getFCMToken=async()=>{
    name=await AsyncStorage.getItem("NAME")
    email= await AsyncStorage.getItem("EMAIL")
    console.log(email)
    // token = await messaging().getToken()
    // console.log(token)
  }

  //open camera
  const openCamera=async()=>{
    const result= await launchCamera({mediaType:"photo"})
    setImageData(result)
    console.log(result)
  }
 
  //open gallery
  const openGallery=async()=>{
    const result=await launchImageLibrary({mediaType:"photo"})
    setImageData(result)
    
  }

  // upload image
    const uploadImage=async()=>{
      const reference=storage().ref(imagedata.assets[0].fileName)

      // path to existing file on filesystem
      const pathToFile = imagedata.assets[0].uri;
      // uploads file
      await reference.putFile(pathToFile)
      const url = await storage().ref(imagedata.assets[0].fileName).getDownloadURL();
      console.log(url)
      firestore()
      .collection('Posts')
      .add({
        image: url,
        captions:captions,
        email:email,
        name:name

        })
   .then(() => {
    console.log('Post added!');
    
     })
  }

  return (
    <View style={{flex:1}}>

      <View style={styles.contanier}>
      <Text style={{marginLeft:20,fontSize:18,color:"#000",fontWeight:"500"}}>Post</Text>

      <Text style={{
      marginRight:20,fontSize:16,
      color: imagedata!==null?"dodgerblue":"#8e8e8e",
      fontWeight:"500"}}
      onPress={()=>{
        if(imagedata!==null || captions!==null){
          uploadImage()
        }else{
          Alert.alert("Please Select Pics Or Enter Caption")
        }
      }
      }
        >Upload</Text>
      </View>

      <View style={styles.View2}>
        {
          imagedata!==null?
          <Image source={{uri:imagedata.assets[0].uri}} style={{width:60,height:60,borderRadius:10,margin:10}}/>:
          <Image source={require("../Images/photo.png")}style={{width:60,height:60,borderRadius:10,margin:10}}/>

        }
        <TextInput value={captions} onChangeText={(txt)=>setCaptions(txt)}  placeholder="Type Captions Here" style={styles.textInput} />

      </View>

      <TouchableOpacity style={styles.touch} onPress={()=>{openCamera()}} >
        
        <Image source={require("../Images/camera.png")} style={{height:24,width:24,marginLeft:20}}/>
        <Text style={{marginLeft:20}}>Open Camera</Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.touch} onPress={()=>{openGallery()}} >
        <Image source={require("../Images/gallery.png")} style={{height:24,width:24,marginLeft:20}}/>
        <Text style={{marginLeft:20}}>Open Gallery</Text>

      </TouchableOpacity>
      
    </View>
  )
}

export default AddPost

const styles = StyleSheet.create({
  contanier:{
    height:60,
    width:"100%",
    justifyContent:"space-between",
    alignItems:'center',
    borderBottomWidth:.5,
    borderBottomColor:"#8e8e8e",
    flexDirection:"row" 
  },
  View2:{
    height:150,
    width:"90%",
    borderWidth:.3,
    alignSelf:"center",
    alignItems:"center",
    marginTop:20,
    borderColor:"#8e8e8e",
    borderRadius:10,
    flexDirection:"row"
  },
  touch:{
    flexDirection:"row",
    marginTop:25,
    alignItems:"center",
    width:"100%",
    height:50,
    borderBottomWidth:.3,
    borderColor:"#8e8e8e"

  },
  textInput:{
    width:"70%"
  }
})