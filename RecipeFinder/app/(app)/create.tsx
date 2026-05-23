import { router } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RecipeForm from '@/components/recipe/RecipeForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useCreateRecipe } from '@/hooks/queries';
import type { CreateRecipeInput } from '@/types/recipe';

export default function CreateScreen() {
  const { mutate, isPending } = useCreateRecipe();

  const handleSubmit = (data: CreateRecipeInput) => {
    mutate(data, {
      onSuccess: () => {
        Alert.alert('Thành công 🎉', 'Món ăn đã được tạo!', [
          { text: 'Xem món của tôi', onPress: () => router.push('/(app)/user/my-recipes') },
          { text: 'Tạo thêm', style: 'cancel' },
        ]);
      },
      onError: (err) => {
        Alert.alert('Lỗi', (err as Error).message || 'Không thể tạo món ăn. Thử lại nhé.');
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tạo món mới 🍳</Text>
        <View style={{ width: 36 }} />
      </View>

      <RecipeForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Tạo món" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600' },
  title: { ...Typography.h3, color: Colors.textPrimary },
});
