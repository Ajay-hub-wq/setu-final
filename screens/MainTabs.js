
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsList from './ChatsList';
import Calls from './Calls';
import Status from './Status';
import Settings from './Settings';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
export default function MainTabs(){
  return (
    <Tab.Navigator screenOptions={{ headerShown:false, tabBarStyle:{backgroundColor:'#1a1207', borderTopColor:'#2a2010'}, tabBarActiveTintColor:'#d4a76a', tabBarInactiveTintColor:'#9ca3af' }}>
      <Tab.Screen name="Chats" component={ChatsList} options={{ tabBarIcon:({c,s})=> <Ionicons name="chatbubbles" size={s} color={c}/> }} />
      <Tab.Screen name="Status" component={Status} options={{ tabBarIcon:({c,s})=> <Ionicons name="aperture" size={s} color={c}/> }} />
      <Tab.Screen name="Calls" component={Calls} options={{ tabBarIcon:({c,s})=> <Ionicons name="call" size={s} color={c}/> }} />
      <Tab.Screen name="Settings" component={Settings} options={{ tabBarIcon:({c,s})=> <Ionicons name="settings" size={s} color={c}/> }} />
    </Tab.Navigator>
  );
}
