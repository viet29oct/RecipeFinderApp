import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AsyncState } from '@/components/ui/AsyncState';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useDeleteRecipe, useMyRecipes } from '@/hooks/queries';
import type { Recipe } from '@/types/recipe';

function MyRecipeCard({
  recipe,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardMain}
        onPress={() => router.push(`/food/${recipe.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.cardInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
          <Text style={styles.cardName} numberOfLines={2}>
            {recipe.name}
          </Text>
          <Text style={styles.cardTime}>⏱ {recipe.time}</Text>
          {recipe.description ? (
            <Text style={styles.cardDesc} numberOfLines={2}>
              {recipe.description}
            </Text>
          ) : null}
        </View>
        <View style={styles.cardStats}>
          <Text style={styles.statNum}>{recipe.ingredients.length}</Text>
          <Text style={styles.statLabel}>nguyên{'\n'}liệu</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
          <Text style={styles.editBtnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color={Colors.error} />
          <Text style={styles.deleteBtnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyRecipesScreen() {
  const { data: recipes = [], isLoading, error, refetch } = useMyRecipes();
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();

  const handleDelete = (recipe: Recipe) => {
    Alert.alert(
      'Xóa món ăn',
      `Bạn có chắc muốn xóa "${recipe.name}"? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () =>
            deleteRecipe(recipe.id, {
              onError: () =>
                Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại.'),
            }),
        },
      ]
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
        <Text style={styles.headerTitle}>Món ăn của tôi 👨‍🍳</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/create')}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <AsyncState
        isLoading={isLoading || isDeleting}
        error={error}
        onRetry={refetch}
        isEmpty={recipes.length === 0}
        emptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Chưa có món nào</Text>
            <Text style={styles.emptySubtitle}>
              Nhấn nút + để tạo món ăn đầu tiên của bạn!
            </Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => router.push('/(app)/create')}
            >
              <Text style={styles.createBtnText}>Tạo món ngay</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MyRecipeCard
              recipe={item}
              onEdit={() => router.push(`/(app)/user/edit-recipe/${item.id}`)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.countText}>
              {recipes.length} món bạn đã tạo
            </Text>
          }
        />
      </AsyncState>
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
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '300', lineHeight: 28 },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  countText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardInfo: { flex: 1 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '18',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
  },
  categoryText: { ...Typography.label, color: Colors.primary, fontSize: 10 },
  cardName: { ...Typography.bodyBold, color: Colors.textPrimary, marginBottom: 4 },
  cardTime: { ...Typography.caption, color: Colors.primary, fontWeight: '600', marginBottom: 4 },
  cardDesc: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  cardStats: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
  },
  statNum: {
    ...Typography.h2,
    color: Colors.primary,
    fontSize: 22,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  editBtnText: { ...Typography.label, color: Colors.primary, fontWeight: '700' },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: 6,
  },
  deleteBtnText: { ...Typography.label, color: Colors.error, fontWeight: '700' },
  empty: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyEmoji: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.xs },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  createBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  createBtnText: { ...Typography.bodyBold, color: '#fff' },
});
