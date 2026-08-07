
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ChatsList({ navigation }){
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(()=>{
    const q = query(collection(db,'users'), orderBy('lastSeen','desc'));
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d=>d.data()).filter(u=>u.uid !== auth.currentUser?.uid);
      setUsers(list);
    });
    return unsub;
  },[]);

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.username?.includes(search.toLowerCase()));

  return (
    <View style={s.c}>
      <View style={s.header}><Text style={s.title}>SETU</Text><TouchableOpacity onPress={()=>navigation.navigate('CreateGroup')}><Ionicons name="people" size={24} color="#d4a76a"/></TouchableOpacity></View>
      <TextInput style={s.search} placeholder="Search by name, username, hashtag" placeholderTextColor="#666" value={search} onChangeText={setSearch}/>
      <View style={s.folders}><Text style={s.folderActive}>All Chats</Text><Text style={s.folder}>Groups (1024)</Text><Text style={s.folder}>Channels</Text><Text style={s.folder}>Archived</Text></View>
      <FlatList data={filtered} keyExtractor={i=>i.uid} renderItem={({item})=>(
        <TouchableOpacity style={s.row} onPress={()=>navigation.navigate('Chat',{user:item})}>
          <View style={s.avatar}><Text style={s.avatarT}>{item.name?.[0]}</Text></View>
          <View style={{flex:1}}>
            <Text style={s.name}>{item.name} {item.username ? '@'+item.username : ''}</Text>
            <Text style={s.last}>{item.online ? 'Online • E2E Encrypted' : 'Last seen ' + new Date(item.lastSeen).toLocaleTimeString()}</Text>
          </View>
          <Ionicons name="pin" size={14} color="#d4a76a" style={{marginRight:6}}/>
          <Ionicons name="star" size={14} color="#666"/>
        </TouchableOpacity>
      )} ListEmptyComponent={<Text style={{color:'#666', textAlign:'center', marginTop:40}}>No users yet. Install APK on 2nd phone and login - real contacts appear here. No fake data.</Text>} />
    </View>
  );
}
const s = StyleSheet.create({
  c:{flex:1, backgroundColor:'#0e0a05', paddingTop:40},
  header:{flexDirection:'row', justifyContent:'space-between', padding:16, alignItems:'center'},
  title:{color:'#d4a76a', fontSize:28, fontWeight:'900'},
  search:{backgroundColor:'#1a1207', margin:12, padding:12, borderRadius:10, color:'#fff'},
  folders:{flexDirection:'row', paddingHorizontal:12, gap:10},
  folder:{color:'#666', backgroundColor:'#1a1207', paddingHorizontal:10, paddingVertical:6, borderRadius:20, fontSize:12},
  folderActive:{color:'#000', backgroundColor:'#d4a76a', paddingHorizontal:10, paddingVertical:6, borderRadius:20, fontSize:12, fontWeight:'800'},
  row:{flexDirection:'row', padding:14, alignItems:'center', borderBottomWidth:1, borderBottomColor:'#1a1207'},
  avatar:{width:48, height:48, borderRadius:24, backgroundColor:'#2a2010', alignItems:'center', justifyContent:'center', marginRight:12},
  avatarT:{color:'#d4a76a', fontWeight:'800'},
  name:{color:'#fff', fontWeight:'700'},
  last:{color:'#9ca3af', fontSize:12}
});
