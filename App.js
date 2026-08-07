
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Login';
import MainTabs from './screens/MainTabs';
import ChatScreen from './screens/Chat';
import CallScreen from './screens/CallScreen';
import GroupInfo from './screens/GroupInfo';
import CreateGroup from './screens/CreateGroup';
import ChannelScreen from './screens/ChannelScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
        <Stack.Screen name="GroupInfo" component={GroupInfo} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="Channel" component={ChannelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
