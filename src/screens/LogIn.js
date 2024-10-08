import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../Common/CustomInput'
import CustomButton from '../Common/CustomButton'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'

const LogIn = () => {
  const navigation=useNavigation()
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("")

  const saveDAata=()=>{
    firestore()
     .collection('Users')
  // Filter results
     .where('email', '==', email)
     .get()
     .then(querySnapshot => {
      console.log(querySnapshot.docs)
      if(querySnapshot.docs.length > 0){
        if(querySnapshot.docs[0]._data.email === email &&
          querySnapshot.docs[0]._data.password  === password
        ){
          Alert.alert("user longed in successfully");
          goToHome(querySnapshot.docs[0]._data.userId)
         
        }else{
          Alert.alert("email or passwor incorect")
        }
        console.log(querySnapshot.docs[0]._data.email+ 
          " " + querySnapshot.docs[0]._data.password)
      }
      else{
        console.log("No user found")
      }
      
  }).catch(error=>{
    console.log(error)
  });
 



  }
const goToHome=async userId=>{
  await AsyncStorage.setItem("userId",userId)
  navigation.navigate("Home")
  

}
  return (
    <View style={{flex:1}}>
      <Text style={styles.Text}>FZone</Text>
      <CustomInput
      icon={require("../Images/mail.png")}
      placeholder="Enter Email"
      value={email}
      onChangeText={(text)=>setEmail(text)}
      keyboardType="email-address"
      />

<CustomInput
      icon={require("../Images/padlock.png")}
      placeholder="Enter Password"
      value={password}
      onChangeText={(text)=>setPassword(text)}
      type={"password"}
      />
      <Text style={styles.txt}>Forget Password</Text>

      <CustomButton
      bgColor="dodgerblue"
      title={"Log In"}
      txtcolor={"white"}
      onPress={()=>{saveDAata()}}
      
      />

      <View style={styles.last}>
        <Text>
          Don't have an account?
        </Text>
        <Text style={{color:"dodgerblue",fontWeight:"500"}}
        onPress={()=>{navigation.navigate("SignUp")}}
        >Sign Up</Text>

      </View>
      


    </View>
  )
}

export default LogIn

const styles = StyleSheet.create({
  Text:{
    alignSelf:"center",
    fontSize:45,
    marginTop:150,
    fontWeight:"bold",
    color:"black",
    fontStyle:"italic",


  },
  txt:{
    alignSelf:"center",
    color:"dodgerblue",
    marginTop:10,
    fontSize:13,
    marginLeft:170,
    fontWeight:'500'
  },
  last:{
    justifyContent:"center",
    backgroundColor:'white',
    flexDirection:"row",
    marginTop:210,
    padding:22,
    borderTopWidth:.1,
    
  }
})