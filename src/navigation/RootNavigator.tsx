import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import AnimeDetailScreen from '../screens/AnimeDetailScreen';
import PlayerScreen from '../screens/PlayerScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  AnimeDetail: {
    animeId: string;
    title: string;
  };
  Player: {
    episodeId: string;
    videoUrl: string;
    episodeTitle: string;
    animeTitle: string;
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: '#000000',
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: '#F2F2F7', // iOS Light Gray Background
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'المكتبة', // Arabic for Library
            headerLargeTitle: true,
            headerLargeTitleStyle: {
              fontWeight: 'bold',
              fontSize: 34,
            },
          }}
        />
        <Stack.Screen
          name="AnimeDetail"
          component={AnimeDetailScreen}
          options={({ route }) => ({
            headerTitle: route.params.title,
            headerTransparent: true,
            headerTintColor: '#FFFFFF',
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTitleStyle: {
                opacity: 0, // Hidden initially, usually handled by scroll offset in Detail screen
            }
          })}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{
            headerShown: false,
            orientation: 'landscape',
            autoHideHomeIndicator: true,
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTitle: 'الإعدادات', // Arabic for Settings
            presentation: 'modal',
            headerStyle: {
              backgroundColor: '#F2F2F7',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;