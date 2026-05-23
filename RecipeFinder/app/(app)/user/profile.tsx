import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store';
import { useMyRecipes } from '@/hooks/queries';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: myRecipes = [] } = useMyRecipes();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (refreshToken) {
        await authService.logout(refreshToken).catch(() => {});
      }
    } finally {
      clearAuth();
      queryClient.clear();
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👩‍🍳</Text>
        </View>

        <Text style={styles.name}>{user?.name ?? 'Người dùng'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>

        {user?.role ? (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        ) : null}

        <Text style={styles.subtitle}>Quản lý thông tin và theo dõi các món bạn yêu thích.</Text>

        {/* ── Món ăn của bạn ── */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(app)/user/my-recipes')}
          activeOpacity={0.8}
        >
          <View style={styles.menuIcon}>
            <Text style={{ fontSize: 20 }}>👨‍🍳</Text>
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Món ăn của bạn</Text>
            <Text style={styles.menuSub}>
              {myRecipes.length > 0
                ? `${myRecipes.length} món bạn đã tạo`
                : 'Tạo và quản lý công thức của riêng bạn'}
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* ── Đăng xuất ── */}
        <TouchableOpacity
          style={[styles.button, isLoggingOut && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Đăng xuất</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarText: { fontSize: 42 },
  name: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  email: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: Spacing.lg,
  },
  roleText: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuLabel: { ...Typography.bodyBold, color: Colors.textPrimary, marginBottom: 2 },
  menuSub: { ...Typography.caption, color: Colors.textSecondary },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minWidth: 140,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
});
