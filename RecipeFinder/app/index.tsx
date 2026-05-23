import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store';

export default function IndexScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  // Wait for AsyncStorage rehydration before deciding where to go
  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(app)/home' : '/(auth)/welcome'} />;
}
