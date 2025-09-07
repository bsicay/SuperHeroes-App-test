import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from '@theme/index';
import Icon from '@components/Icon';

// Screens
import HomeScreen from '@features/home/HomeScreen';
import HeroesListScreen from '@features/heroes/screens/HeroesListScreen';
import HeroDetailScreen from '@features/heroes/screens/HeroDetailScreen';
import FavoritesScreen from '@features/favorites/screens/FavoritesScreen';
import TeamsScreen from '@features/teams/screens/TeamsScreen';
import TeamBuilderScreen from '@features/teams/screens/TeamBuilderScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  HeroDetail: { heroId: number };
  TeamBuilder: { teamId?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Heroes: undefined;
  Teams: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.card,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary[300],
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'superhero' | 'team' | 'favorite';
          
          switch (route.name) {
            case 'Heroes':
              iconName = 'superhero';
              break;
            case 'Teams':
              iconName = 'team';
              break;
            case 'Favorites':
              iconName = 'favorite';
              break;
            default:
              iconName = 'superhero';
          }
          
          return <Icon name={iconName} size={size} color={color} active={focused} />;
        },
      })}
    >
      <Tab.Screen 
        name="Heroes" 
        component={HeroesListScreen}
        options={{
          tabBarLabel: 'Superheroes',
        }}
      />
      <Tab.Screen 
        name="Teams" 
        component={TeamsScreen}
        options={{
          tabBarLabel: 'Teams',
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.card,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.semiBold,
          fontSize: theme.typography.fontSize.lg,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="HeroDetail" 
        component={HeroDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="TeamBuilder" 
        component={TeamBuilderScreen}
        options={{
          title: 'Constructor de Equipos',
          headerBackTitle: 'Atrás',
        }}
      />
    </Stack.Navigator>
  );
}
