import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { initDB } from '@/services/db';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // expo-sqlite's web worker requires SharedArrayBuffer which needs
    // cross-origin isolation headers not available in Metro dev server.
    // This app targets Expo Go (native) — skip DB init on web.
    if (Platform.OS !== 'web') {
      initDB();
    }
    setDbReady(true);
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
