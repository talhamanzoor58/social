import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'

const CustomInput = ({icon,placeholder,value,onChangeText,keyboardType,type}) => {
  return (
    <View style={styles.main}>
    <Image source={icon} style={{height:24,width:24}}/>
    <TextInput
    style={{marginLeft:5}}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    secureTextEntry={type? true :false}
    />
    
      
      
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
    main:{
        alignItems:"center",
        height:42,
        width:"80%",
        borderWidth:.5,
        borderRadius:10,
        alignSelf:"center",
        marginTop:30,
        paddingLeft:15,
        paddingRight:15,
        flexDirection:'row'

    }
})