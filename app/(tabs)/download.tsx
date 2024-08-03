import { StyleSheet,Text, Image, Platform,View ,FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';

export default function TabTwoScreen() {
    const styles = StyleSheet.create({
        container: {
          backgroundColor: '#0F0F0F',
          height: '100%',
          flex: 1,
        },
        header: {
          flexDirection: 'row',
          padding: 10,
          backgroundColor: '#202020',
          marginBottom: 20,
          alignItems: 'center',
        },
        logo: {
          height: 30,
          width: 30,
          marginRight: 10,
        },
        headerText: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 24,
        },
        list: {
          padding: 10,
        },
        itemContainer: {
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        },
        image: {
          width: 100,
          height: 100,
          marginRight: 10,
          borderRadius: 10,
        },
        fileName: {
          color: 'white',
          fontSize: 16,
        },
        Txt:{
            color:'white', 
            fontWeight: "bold",
            fontSize: 24,
          }
      });

      const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
        try {
          // Request permissions
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access media library is required.');
            return;
          }
  
          // Fetch media assets
          const { assets } = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaTypeOptions.photo,
            first: 100, // Limit the number of results
            sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Sort by creation time
          });
  
          // Filter assets if necessary
          setMedia(assets);
        } catch (error) {
          Alert.alert('Error', `Failed to fetch media: ${error.message}`);
        }}

    fetchMedia();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <Text style={styles.fileName}>{item.filename}</Text>
    </View>
  );
    return (

    <SafeAreaView style={{backgroundColor:'#0F0F0F',height:'100%'}}>
        <View style={{flexDirection:'row',padding:10,backgroundColor:'#202020',marginBottom:20}}> 
            <Image style={{height:30,width:30,marginRight:10}} source={require("../../assets/images/unnamed.png")}></Image> 
            <Text style={styles.Txt} >Downloaded File</Text>
        </View>
        <View>
            <Text style={{color:'white'}}>Not Implimented now</Text>
            {/*                    imliment the feterter to this place                 */}
        </View>
        <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
    );

    
    
  }