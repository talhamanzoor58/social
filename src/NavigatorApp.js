import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from './screens/SplashScreen'
import LogIn from './screens/LogIn'
import SignUp from './screens/SignUp'

const Stack=createStackNavigator()
const NavigatorApp = () => {
    
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Splash Screen" component={SplashScreen} options={{headerShown:false}} />
            <Stack.Screen name='LogIn' component={LogIn} options={{headerShown:false}}/>
            <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}} />
        </Stack.Navigator>
    </NavigationContainer>
    
  )
}

export default NavigatorApp

const styles = StyleSheet.create({})