import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback, useRef } from "react";
import { Image, ScrollView, StyleSheet, TextInput } from "react-native";
import { FlatList } from "react-native";
import { Linking } from "react-native";
import { TouchableOpacity } from "react-native";
import { Button, View, Alert, Text,Platform } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import { Alert, Platform } from 'react-native';
// import * as Permissions from 'expo-permissions';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


export default function HomeScreen() {
 
  const [playing, setPlaying] = useState(false);
  const [downloadUrl,setDownloadUrl]=useState([])
  const [textInputValue, setTextInputValue] = useState('');

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
}, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  

  const getData=useCallback(async ()=>{
    
    console.log(textInputValue)
    // Alert.alert('No URL', textInputValue);
    
    if (!textInputValue) {
      Alert.alert('No URL', 'Please enter a YouTube URL.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.168:5000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: textInputValue }),
      });

      const data = await response.json();

      // Assuming you want to handle the download URL or some other data from the response
      console.log('Available formats:', data);
      setDownloadUrl(data);  // Example: set the URL of the first format
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data from the server.');
    }
  },[textInputValue])

  const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={{
         fontSize: 18,
         color: "#000",
         fontWeight: "bold",
         alignSelf: "center",
         textTransform: "uppercase"
      }}>{title}</Text>
    </TouchableOpacity>
  );
  const AppButtonDownload = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainerDonload}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
  const styles = StyleSheet.create({
    // ...
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginLeft:40,
      marginRight:40,
      marginTop:10
    }, appButtonContainerDonload: {
      elevation: 8,
      backgroundColor: "#FF0000",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginLeft:40,
      marginRight:40,
      marginTop:10,
      marginBottom:10
    },
    appButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },Txt:{
      color:'white', 
      fontWeight: "bold",
      fontSize: 24,
    }
  });

  const extractYouTubeVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const [vId, setVId] = React.useState('I-FoRaBuVnA');

  const handleTextChange = (text) => {
    
    const videoID = extractYouTubeVideoID(text);
    if (videoID) {
      console.log('Video ID:', videoID);
      setTextInputValue('https://www.youtube.com/watch?v='+videoID);
      setVId(videoID);
      console.log('url :  ','https://www.youtube.com/watch?v='+videoID)
     
      console.log(textInputValue)
      // Do something with the video ID
    } else if (text !== '') {
      Alert.alert('Invalid URL', 'Please enter a valid YouTube URL.');
    }
  };

  // const renderItem = ({ item }) => (
  //   <View  >
  //     <TouchableOpacity onPress={()=>Linking.openURL(item.url)} style={{flexDirection:'row', height:44,gap:10,backgroundColor:'#202020',marginBottom:10,marginLeft:20,marginRight:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
  //     <Text style={{color:'white'}}>{item.video_ext}</Text>
  //     <Text style={{color:'white'}}>{item.resolution}</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
  const renderItem = ({ item }) => (
    <View>
    <TouchableOpacity
      onPress={() => downloadFile(item.url, `video_${item.resolution}.${item.video_ext}`,item.video_ext)}
      style={{flexDirection:'row', height:44,gap:10,backgroundColor:'#202020',marginBottom:10,marginLeft:20,marginRight:20,borderRadius:10,justifyContent:'center',alignItems:'center'}}
    >
      <Text style={{color:'white'}}>{item.video_ext}</Text>
      <Text style={{color:'white'}}>{item.resolution}</Text>
    </TouchableOpacity>
  </View>
  );

//   // Request permission to access external storage
// const requestStoragePermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//       {
//         title: 'Storage Permission',
//         message: 'This app needs access to your storage to save files.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

//   const downloadFile = async (url, fileName) => {
//     try {
//       if (Platform.OS === 'android') {
//         const hasPermission = await requestStoragePermission();
//         if (!hasPermission) {
//           Alert.alert('Permission Denied', 'Storage permission is required.');
//           return;
//         }
//       }
      
//       const downloadDest = `${getDownloadPath()}${fileName}`;
      
//       // Ensure the directory exists
//       await RNFS.mkdir(getDownloadPath());
  
//       // Start downloading
//       const result = await RNFS.downloadFile({
//         fromUrl: url,
//         toFile: downloadDest,
//       }).promise;
  
//       if (result.statusCode === 200) {
//         Alert.alert('Download Complete', `File saved to ${downloadDest}`);
//       } else {
//         Alert.alert('Download Failed', `Status code: ${result.statusCode}`);
//       }
//     } catch (error) {
//       Alert.alert('Download Error', error.message);
//     }
//   };
// Function to request storage permission on Android
const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }
  return true;
};

// Function to get the download path based on the platform
const getDownloadPath = () => {
  if (Platform.OS === 'android') {
    return `${FileSystem.documentDirectory}Download/`;
  }
  return FileSystem.documentDirectory;

};

// Function to determine file extension from URL
const getFileExtension = (url) => {
  const match = url.match(/\.[0-9a-z]+$/i);
  return match ? match[0] : '.tmp'; // Default to .tmp if no extension found
};

// Main function to download the file
const downloadFile = async (url,fn,ext) => {
  try {
    // Request permission if on Android
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        return;
      }
    }

    // Determine file extension and set file name
    const fileExtension = ext;
    const fileName = `Download${fn}`;
    const downloadDest = `${getDownloadPath()}${fileName}`;

    // Ensure the directory exists
    await FileSystem.makeDirectoryAsync(getDownloadPath(), { intermediates: true });

    // Start downloading
    const { uri } = await FileSystem.downloadAsync(url, downloadDest);

    // Optionally, save to media library on Android
    if (Platform.OS === 'android') {
      await MediaLibrary.createAssetAsync(uri);
    }

    Alert.alert('Download Complete', `File saved to ${uri}`);
  } catch (error) {
    Alert.alert('Download Error', error.message);
  }
};
  return (
    <SafeAreaView style={{backgroundColor:'#0F0F0F',height:'100%'}} >
    <View style={{flexDirection:'row',padding:10,backgroundColor:'#202020',marginBottom:20}}> 
      <Image style={{height:30,width:30,marginRight:10}} source={require("../../assets/images/unnamed.png")}></Image> 
      <Text style={styles.Txt} >YT Downloader</Text>
    </View>
    <View >
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={vId}
        onChangeState={onStateChange}
      />
    </View>
    <ScrollView  style={{marginBottom:44}}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 40, marginRight: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20 }}>
      <TextInput
        style={{
          height: 35,
          color: 'white',
          flexGrow: 1,
        }}
        onChangeText={handleTextChange}
        value={textInputValue}
        placeholder="Insert your text!"
      />
      <Image style={{ height: 16, width: 16, marginRight: 10 }} source={require("../../assets/images/icons8-search-24.png")} />
    </View>
    <AppButton title={playing ? "pause" : "play"} onPress={togglePlaying}></AppButton>
    <AppButtonDownload title={'Download'} onPress={getData}></AppButtonDownload>

        <FlatList
        data={downloadUrl}
        renderItem={renderItem}
        />
    </ScrollView>
    
    {/* <View style={{flexDirection:'row',height:44,position:'absolute',bottom:0,width:'100%',justifyContent:'space-around',padding:10,backgroundColor:'#202020'}}> 
      <TouchableOpacity style={{flexDirection:'row'}}>
      <Image style={{height:16,width:16,marginRight:10}} source={require("../../assets/images/icons8-home-32.png")}></Image>
        <Text style={{
         fontSize: 16,
         color: "#fff",
         fontWeight: "400",
         alignSelf: "center",
         textTransform: "uppercase"
      }}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{flexDirection:'row'}}>
      <Image style={{height:16,width:16,marginRight:10}} source={require("../../assets/images/icons8-cloud-vulnerability-30.png")}></Image>
        <Text style={{
         fontSize: 16,
         color: "#fff",
         fontWeight: "400",
         alignSelf: "center",
         textTransform: "uppercase"
      }}>Download</Text>
      </TouchableOpacity>
    </View> */}
    </SafeAreaView>
  );
}
