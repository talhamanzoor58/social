import { StyleSheet, Text, TouchableOpacity, View,PermissionsAndroid, Image } from 'react-native'
import React, { useState } from 'react'
import {launchCamera,launchImageLibrary} from "react-native-image-picker"
import storage from '@react-native-firebase/storage';
import { openPhotoPicker } from 'react-native-permissions';

const Home = () => {
  const[imagedata,setImageData]=useState(null)
  const[imageurl,setImageUrl]=useState(null)
  // for camera open
  const openCamera=async()=>{
    const result= await launchCamera({mediaType:"photo"})
    setImageData(result)
    console.log(result)

  }
 // for upload image
  const uploadImage=async()=>{
    const reference=storage().ref(imagedata.assets[0].fileName)
     // path to existing file on filesystem
     const pathToFile = imagedata.assets[0].uri;
     // uploads file
     await reference.putFile(pathToFile)
     const url = await storage().ref(imagedata.assets[0].fileName).getDownloadURL();
     console.log(url)

  }
 // for camera permission
  const requestPermision=async()=>{
    try{
      const granted =await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
             title:"Social App Camera Permission",
             message:"Social App want Need Access To Your Camera"+
             "So you Can Take Awesome picture",
             buttonNeutral:"Ask me later",
             buttonNegative:"Cancel",
             buttonPositive:"OK"
        }
      );
      if(granted == PermissionsAndroid.RESULTS.GRANTED){
        openCamera()
      }else{
        console.log("Camera permission denied")
      }
    } catch (error){
      console.warn(error)
    }

  }
  //for gallery permission
  // const requestPermision2=async()=>{
  //   try{
  //     const granted =await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //       {
  //            title:"Social App Camera Permission",
  //            message:"Social App want Need Access To Your Camera"+
  //            "So you Can Take Awesome picture",
  //            buttonNeutral:"Ask me later",
  //            buttonNegative:"Cancel",
  //            buttonPositive:"OK"
  //       }
  //     );
  //     if(granted == PermissionsAndroid.RESULTS.GRANTED){
  //       openGallery()
  //     }else{
  //       console.log("Camera permission denied")
  //     }
  //   } catch (error){
  //     console.warn(error)
  //   }

  // }

  return (
    <View style={styles.main}>
      {imagedata!==null?(
        <Image source={{uri:imagedata.assets[0].uri}} style={{height:200,width:200,marginBottom:7}}/>
      ):null}
      <TouchableOpacity style={styles.touch} onPress={()=>requestPermision()}>
      <Text style={{fontWeight:"800"}}>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.touch} onPress={()=>{uploadImage()}}>
        <Text style={{fontWeight:"800"}}>upload Image</Text>

      </TouchableOpacity>
     
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  main:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"

  },
  touch:{
    justifyContent:"center",
    alignItems:"center",
    height:50,
    width:200,
    borderRadius:10,
    borderWidth:.5,
    marginTop:10


  }
})