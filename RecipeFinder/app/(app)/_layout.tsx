import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store';

/** Nút (+) nổi giữa thanh tab bar. */
function CreateTabButton() {
  return (
    <TouchableOpacity
      style={styles.createBtn}
      onPress={() => router.navigate('/(app)/create')}
      activeOpacity={0.85}
    >
      <View style={styles.createBtnInner}>
        <Text style={styles.createBtnText}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AppTabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  // Guard: redirect to login if not authenticated (e.g. after token cleared on 401)
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, hasHydrated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          borderTopColor: Colors.border,
          backgroundColor: Colors.surface,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Nút (+) tạo món — không có route thật, chỉ navigate khi nhấn */}
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarButton: () => <CreateTabButton />,
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Đã lưu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user/profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden screens — không hiển thị trong tab bar */}
      <Tabs.Screen name="food/[id]" options={{ href: null }} />
      <Tabs.Screen name="user/my-recipes" options={{ href: null }} />
      <Tabs.Screen name="user/edit-recipe/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  createBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -14,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
    marginTop: -2,
  },
});
