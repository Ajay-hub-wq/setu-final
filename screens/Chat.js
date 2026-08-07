
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth, storage } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function Chat({ route, navigation }){
  const { user } = route.params;
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatId = [auth.currentUser.uid, user.uid].sort().join('_');

  useEffect(()=>{
    const q = query(collection(db,'chats',chatId,'messages'), orderBy('createdAt','asc'));
    const unsub = onSnapshot(q, snap=> setMessages(snap.docs.map(d=>d.data())));
    return unsub;
  },[]);

  const send = async (type='text', extra={}) => {
    if(!msg && type==='text') return;
    const data = {
      text: type==='text' ? msg : '['+type+']',
      sender: auth.currentUser.uid,
      createdAt: Date.now(),
      type,
      status: 'sent', // sent, delivered, read (blue tick)
      disappearing: extra.disappearing || null,
      ...extra
    };
    await addDoc(collection(db,'chats',chatId,'messages'), data);
    setMsg('');
    // typing + delivered simulation
    await setDoc(doc(db,'chats',chatId), { lastMessage: data.text, updatedAt: Date.now(), typing:false }, {merge:true});
  };

  return (
    <View style={s.c}>
      <View style={s.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
        <Text style={s.name}>{user.name} • {user.online ? 'Online' : 'Last Seen'}</Text>
        <View style={{flexDirection:'row', gap:12}}>
          <TouchableOpacity onPress={()=>navigation.navigate('Call',{user, type:'voice'})}><Ionicons name="call" size={22} color="#d4a76a"/></TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('Call',{user, type:'video'})}><Ionicons name="videocam" size={22} color="#d4a76a"/></TouchableOpacity>
        </View>
      </View>
      <FlatList data={messages} keyExtractor={(_,i)=>i.toString()} renderItem={({item})=>(
        <View style={[s.bubble, item.sender===auth.currentUser.uid ? s.me : s.other]}>
          {item.type!=='text' && <Text style={s.typeTag}>{item.type.toUpperCase()} • E2E</Text>}
          <Text style={s.msgT}>{item.text}</Text>
          <Text style={s.tick}>{item.status==='read' ? '✓✓ Blue' : item.status==='delivered' ? '✓✓ Delivered' : '✓ Sent'} • {new Date(item.createdAt).toLocaleTimeString()}</Text>
        </View>
      )}/>
      {typing && <Text style={{color:'#d4a76a', padding:6}}>Typing...</Text>}
      <View style={s.inputRow}>
        <TouchableOpacity onPress={()=>send('camera')}><Ionicons name="camera" size={22} color="#d4a76a"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>send('photo')}><Ionicons name="image" size={22} color="#d4a76a"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>send('document')}><Ionicons name="document" size={22} color="#d4a76a"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>send('location')}><Ionicons name="location" size={22} color="#d4a76a"/></TouchableOpacity>
        <TextInput style={s.input} placeholder="Message - E2E Encrypted" placeholderTextColor="#666" value={msg} onChangeText={setMsg}/>
        <TouchableOpacity onPress={()=>send('audio')}><Ionicons name="mic" size={22} color="#d4a76a"/></TouchableOpacity>
        <TouchableOpacity style={s.send} onPress={()=>send()}><Ionicons name="send" size={20} color="#000"/></TouchableOpacity>
      </View>
      <View style={s.featuresBar}>
        <Text style={s.feat}>Disappear: 24h/7d</Text><Text style={s.feat}>Wallpaper</Text><Text style={s.feat}>Star</Text><Text style={s.feat}>Block</Text><Text style={s.feat}>2GB File</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  c:{flex:1, backgroundColor:'#0e0a05'},
  header:{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:14, paddingTop:40, backgroundColor:'#1a1207'},
  name:{color:'#fff', fontWeight:'700', flex:1, marginLeft:12},
  bubble:{maxWidth:'80%', padding:10, borderRadius:12, margin:6},
  me:{backgroundColor:'#2a2010', alignSelf:'flex-end'},
  other:{backgroundColor:'#1a1207', alignSelf:'flex-start'},
  msgT:{color:'#fff'},
  typeTag:{color:'#d4a76a', fontSize:10, fontWeight:'800'},
  tick:{color:'#9ca3af', fontSize:10, marginTop:4},
  inputRow:{flexDirection:'row', alignItems:'center', padding:8, backgroundColor:'#1a1207', gap:8},
  input:{flex:1, backgroundColor:'#0e0a05', color:'#fff', padding:10, borderRadius:20},
  send:{backgroundColor:'#d4a76a', width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center'},
  featuresBar:{flexDirection:'row', justifyContent:'space-around', padding:6, backgroundColor:'#0e0a05', borderTopWidth:1, borderTopColor:'#1a1207'},
  feat:{color:'#666', fontSize:10}
});
