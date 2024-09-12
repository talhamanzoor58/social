import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const SplashScreen = () => {
    const navigation=useNavigation()
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate("LogIn")

        },3000)

    },[])
  return (
    <View style={styles.main}>
        <Image source={require("../Images/InstaLogo.png")} style={styles.image}/>
      
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    main:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        width:200,
        height:200,
        borderRadius:100,
        resizeMode:"cover"

    }
})