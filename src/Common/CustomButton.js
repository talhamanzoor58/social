import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

const CustomButton = ({bgColor,title,txtcolor,onPress}) => {
  return (
    <TouchableOpacity
    style={{
        
        background:bgColor,
        justifyContent:"center",
        alignSelf:"center",
        alignItems:"center",
        height:40,
        width:"80%",
        borderRadius:10,
        backgroundColor:bgColor,
        marginTop:18
    }}
    onPress={()=>onPress()}
    >
        
    <Text style={{color:txtcolor,fontWeight:"600"}}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    
})