import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';

const Main = () => {
  const[postData,setPostData]=useState([])
  useEffect(() => {
    getData()
  });

  const getData = () => {
    let tempData=[]
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {

        console.log('Total Posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data())
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        });
        setPostData(tempData)
      });
  };

  return (
    <View style={{flex:1}}>
      <View style={styles.header}>
        <Text style={styles.text}>FZone</Text>
      </View>
      {
        postData.length>0?(
         
          <FlatList
          showsVerticalScrollIndicator={false}
          data={postData}
          renderItem={({item,index})=>{
           return(
             <View style={[styles.contaier,{ marginBottom: (postData.length - 1) === index ? 80 : 0 }]}>
              <View style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
                <Image source={require("../Images/userP.png")} style={{height:40,width:40,borderRadius:20,marginLeft:10}}/>
                 <Text style={{marginLeft:10,fontSize:18,fontWeight:"600"}}>{item.name}</Text>
              </View>
                <Text style={{marginTop:10,marginBottom:10,marginLeft:20,marginRight:20,fontWeight:"600"}}>{item.captions}</Text>
               <Image source={{uri:item.image}} style={{height:290,width:"98%",alignSelf:"center",borderRadius:15,marginBottom:15}}/>
               <View style={{flexDirection:"row",width:"100%",height:50,marginBottom:10,justifyContent:"space-evenly",alignItems:"center"}}>
                 <TouchableOpacity style={{flexDirection:"row"}}>
                  <Text style={{marginRight:10}}>{"0"}</Text>
                  <Image source={require("../Images/heart.png")} style={{height:24,width:24}}/>
                 </TouchableOpacity>
                 <TouchableOpacity style={{flexDirection:"row"}}>
                  <Text style={{marginRight:10}}>{"0"}</Text>
                  <Image source={require("../Images/comment.png")} style={{height:24,width:24}}/>
                 </TouchableOpacity>
               </View>
               </View>
           )
          }}
          />
        

        ):(
          <View style={{justifyContent:'center',alignItems:"center",flex:1}}>
            <Text style={{fontWeight:"600",fontSize:20}}>No Posts Found</Text>
          </View>
        )
      }
    
    </View>
  ); 
};

export default Main;

const styles = StyleSheet.create({
  contaier:{
    // height:400,
    width:"95%",
    alignSelf:"center",
    marginTop:20,
    backgroundColor:"white",
    borderRadius:20,
    elevation:10,
   
  },
  header:{
    justifyContent:"center",
    height:55,
    width:"100%",
    backgroundColor:"dodgerblue",
    paddingLeft:20
  },
  text:{
    fontSize:25,
    color:"white",
    fontWeight:"bold",
    fontStyle:"italic"

  }
});
