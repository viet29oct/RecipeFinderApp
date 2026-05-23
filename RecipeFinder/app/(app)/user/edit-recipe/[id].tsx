import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import RecipeForm from '@/components/recipe/RecipeForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useRecipe, useUpdateRecipe } from '@/hooks/queries';
import type { CreateRecipeInput } from '@/types/recipe';
import { Ionicons } from '@expo/vector-icons';

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: recipe, isLoading } = useRecipe(id);
  const { mutate: updateRecipe, isPending } = useUpdateRecipe();

  const handleSubmit = (data: CreateRecipeInput) => {
    updateRecipe(
      { id, input: data },
      {
        onSuccess: () => {
          Alert.alert('Đã lưu ✅', 'Món ăn đã được cập nhật.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (err) => {
          Alert.alert('Lỗi', (err as Error).message || 'Không thể cập nhật. Thử lại nhé.');
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa món ✏️</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : recipe ? (
        <RecipeForm
          initial={{
            name: recipe.name,
            description: recipe.description,
            imageUrl: recipe.image,
            category: recipe.category,
            timeLabel: recipe.time,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
          }}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Lưu thay đổi"
        />
      ) : (
        <View style={styles.loading}>
          <Text style={{ color: Colors.textSecondary }}>Không tìm thấy món ăn.</Text>
        </View>
      )}
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
  title: { ...Typography.h3, color: Colors.textPrimary },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
