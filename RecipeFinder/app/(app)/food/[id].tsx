import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AsyncState } from '@/components/ui/AsyncState';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useRecipe } from '@/hooks/queries';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { isApiError } from '@/utils/errors';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const { isSaved, toggleSaved } = useSavedRecipes();
  const { data: recipe, isLoading, error, refetch } = useRecipe(id);

  const notFound = !isLoading && (Boolean(error) || !recipe);
  const isNotFoundError = isApiError(error) && error.code === 'NOT_FOUND';

  if (notFound) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>{isNotFoundError ? '😕' : '⚠️'}</Text>
          <Text style={styles.notFoundText}>
            {isNotFoundError ? 'Không tìm thấy món ăn' : 'Không tải được chi tiết món'}
          </Text>
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={() => (error ? refetch() : router.back())}
          >
            <Text style={styles.goBackText}>{error ? 'Thử lại' : 'Quay lại'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AsyncState isLoading={isLoading} error={error} onRetry={() => refetch()}>
        {recipe ? (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces>
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipe.image }} style={styles.heroImage} resizeMode="cover" />
              <View style={styles.imageOverlay} />
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
              </View>
              <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleSaved(recipe.id)}>
                <Ionicons
                  name={isSaved(recipe.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isSaved(recipe.id) ? Colors.error : Colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
                <View style={styles.stats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>⏱</Text>
                    <Text style={styles.statValue}>{recipe.time}</Text>
                    <Text style={styles.statLabel}>Thời gian</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>🥗</Text>
                    <Text style={styles.statValue}>{recipe.ingredients.length}</Text>
                    <Text style={styles.statLabel}>Nguyên liệu</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>📋</Text>
                    <Text style={styles.statValue}>{recipe.steps.length}</Text>
                    <Text style={styles.statLabel}>Bước làm</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
                  onPress={() => setActiveTab('ingredients')}
                >
                  <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
                    🥬 Nguyên liệu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'steps' && styles.tabActive]}
                  onPress={() => setActiveTab('steps')}
                >
                  <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>
                    👨‍🍳 Cách làm
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'ingredients' ? (
                <View style={styles.tabContent}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientBullet}>
                        <Text style={styles.ingredientBulletText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.tabContent}>
                  {recipe.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumberContainer}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                        {index < recipe.steps.length - 1 && <View style={styles.stepLine} />}
                      </View>
                      <View style={styles.stepContentBox}>
                        <Text style={styles.stepTitle}>Bước {index + 1}</Text>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        ) : null}
      </AsyncState>
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
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  categoryBadge: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg + 94,
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadgeText: {
    ...Typography.label,
    color: '#FFFFFF',
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    minHeight: 500,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  titleSection: {
    marginBottom: Spacing.lg,
  },
  recipeName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  recipeDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  statValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: Spacing.xs,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  ingredientBulletText: {
    ...Typography.label,
    color: Colors.primary,
  },
  ingredientText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  stepNumberContainer: {
    alignItems: 'center',
    marginRight: Spacing.sm,
    width: 36,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    textAlign: 'center',
    lineHeight: 36,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    overflow: 'hidden',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
    marginBottom: -8,
  },
  stepContentBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  stepTitle: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: 4,
  },
  stepText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  notFoundEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  notFoundText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  goBackBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  goBackText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
});
