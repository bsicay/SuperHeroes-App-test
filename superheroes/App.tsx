import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { theme } from './src/theme';
import { database } from './src/services/storage/database';
import SplashScreen from './src/features/splash/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Inicializar la base de datos
      await database.init();
      console.log('[App] Database initialized successfully');
    } catch (error) {
      console.error('[App] Error initializing database:', error);
    }
  };

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={theme.colors.background.primary}
        />
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
