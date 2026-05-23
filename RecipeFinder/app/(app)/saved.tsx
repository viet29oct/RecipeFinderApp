import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { RecipeCardWide } from '@/components/recipe/RecipeCard';
import { AsyncState } from '@/components/ui/AsyncState';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useRecipes } from '@/hooks/queries';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';

export default function SavedScreen() {
  const { savedIds, isLoading: savedLoading } = useSavedRecipes();
  const { data: recipes = [], isLoading: recipesLoading, error, refetch } = useRecipes();

  const isLoading = savedLoading || recipesLoading;

  const savedRecipes = useMemo(
    () => recipes.filter((recipe) => savedIds.includes(recipe.id)),
    [recipes, savedIds]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AsyncState
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        isEmpty={savedRecipes.length === 0}
        emptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤍</Text>
            <Text style={styles.emptyTitle}>Chưa có món nào được lưu</Text>
            <Text style={styles.emptySubtitle}>Hãy bấm tim ở món bạn thích để lưu lại.</Text>
          </View>
        }
      >
        <FlatList
          data={savedRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <RecipeCardWide recipe={item} />
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Món đã lưu ❤️</Text>
              <Text style={styles.subtitle}>
                Bạn đã lưu {savedRecipes.length} món để xem lại và nấu nhanh.
              </Text>
            </View>
          }
        />
      </AsyncState>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  cardWrapper: {
    marginBottom: Spacing.xs,
  },
  empty: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
