import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View ,Text} from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={
        {
        tabBarStyle:{backgroundColor:'#202020',borderWidth:5},
        tabBarActiveTintColor: 'white',
        headerShown: false,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={'white'} />
          ),
        }}
      />

      
      <Tabs.Screen
        name="download"
        options={{
          title: 'Download',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={'white'} />
          ),
        }}
      />
    </Tabs>
  );
}
