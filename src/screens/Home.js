import { StyleSheet, Text, TouchableOpacity, View,PermissionsAndroid, Image } from 'react-native'
import React, { useState} from 'react'
import Main from '../Tabs/Main';
import Search from '../Tabs/Search';
import Chat from '../Tabs/Chat';
import Profile from '../Tabs/Profile';
import AddPost from '../Tabs/AddPost';

const Home = () => {
 
  const[imageurl,setImageUrl]=useState(null)
  const[selected,setSelected]=useState(0)
 
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
      {
        selected==0?(<Main/>):selected==1?(<Search/>):selected==2?(<AddPost/>):selected==3?(<Chat/>):(<Profile/>)
      }
      <View style={styles.bView}>

        <TouchableOpacity style={styles.tch}onPress={()=>setSelected(0)}>
          <View style={styles.bg}>
          <Image source={require("../Images/home.png")} style={{
            width: selected==0?30:25,
            height:selected==0?30:25,
            tintColor:selected==0?"dodgerblue":"#BeBeBe",
            
          }}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tch} onPress={()=>setSelected(1)}>
        <View style={styles.bg}>
          <Image 
          source={require("../Images/search.png")}
          style={{
            width:selected==1?30:25,
            height:selected==1?30:25,
            tintColor:selected==1?"dodgerblue":"#BeBeBe"
          }}
          />  
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tch} onPress={()=>setSelected(2)}>
          <View style={styles.bg}>
            <Image source={require("../Images/add.png")} 
            style={{
              width:selected==2?30:25,
              height:selected==2?30:25,
              tintColor:selected==2?"dodgerblue":"#BeBeBe"
            }}
            />
            </View>
          </TouchableOpacity >

          <TouchableOpacity style={styles.tch} onPress={()=>setSelected(3)}>
          <View style={styles.bg}>
            <Image source={require("../Images/chat.png")}
            style={{
              height:selected==3?30:25,
              width:selected==3?30:25,
              tintColor:selected==3?"dodgerblue":"#BeBeBe"
            }}
            />
            </View>
          </TouchableOpacity >

          <TouchableOpacity style={styles.tch} onPress={()=>setSelected(4)}>
          <View style={styles.bg}>
            <Image source={require("../Images/user.png")}
            style={{
              height:selected==4?30:25,
              width:selected==4?30:25,
              tintColor:selected==4?"dodgerblue":"#BeBeBe"
            }}
            />
            </View>
          </TouchableOpacity>

      </View>
      
     
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  main:{
    flex:1,

  },
  bView:{
    width:"100%",
    height:60,
    position:"absolute",
    justifyContent:"space-evenly",
    alignItems:"center",
    bottom:0,
    flexDirection:"row",
    backgroundColor:"#fff"
    

  },
  bg:{
    justifyContent:"center",
    alignItems:"center",
    height:40,
    width:40,
    backgroundColor:"#f2f2f2",
    borderRadius:16,


  },
  
  touch:{
    justifyContent:"center",
    alignItems:"center",
    height:50,
    width:200,
    borderRadius:10,
    borderWidth:.5,
    marginTop:10
  },
  tch:{
    justifyContent:"center",
    alignItems:"center",
    height:"100%",
    width:"20%"
  }
})