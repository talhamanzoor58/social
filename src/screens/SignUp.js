import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../Common/CustomInput'

const SignUp = () => {
    const[name,setName]=useState("")
    const[number,setNumber]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[confirmPassword,setConfirmPassword]=useState("")
  return (
    <View style={{flex:1}}>
      <Image source={require("../Images/InstaLogo.png") } style={styles.Image}/>
      <Text style={styles.text}>Create New Account</Text>
      <CustomInput
      placeholder="Full Name"
      value={name}
      icon={require("../Images/user.png")}
      onChangeText={(text) => setName(text)}
      />
      <CustomInput
      placeholder="Phone Number"
      value={number}
      icon={require("../Images/otp.png")}
      onChangeText={(text) => setNumber(text)}
      keyboardType={"number-pad"}
      />
      <CustomInput
      placeholder={"Email"}
      value={email}
      icon={require("../Images/mail.png")}
      onChangeText={(text) =>setNumber(text)}
      />
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
 
  text:{
    alignSelf:"center",
    marginTop:30,
    color:"black",
    fontWeight:"600",
    fontSize:22

  },
  Image:{
    height:86,
    width:86,
    alignSelf:"center",
    borderRadius:43,
    marginTop:50
  }
})