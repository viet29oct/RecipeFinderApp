import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const searchIcon = require('../../assets/images/search.png');
const userIcon = require('../../assets/images/user.png');
import { CategoryFilter } from '@/components/recipe/CategoryFilter';
import RecipeCard from '@/components/recipe/RecipeCard';
import { AsyncState } from '@/components/ui/AsyncState';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useRecipes } from '@/hooks/queries';
import { useCategoryFilter } from '@/hooks/use-category-filter';
import { useAuthStore } from '@/store';
import type { Recipe } from '@/types/recipe';

export default function HomeScreen() {
  const { data: recipes = [], isLoading, error, refetch } = useRecipes();
  const user = useAuthStore((s) => s.user);

  const { categories, selectedCategory, setSelectedCategory, filteredRecipes } =
    useCategoryFilter(recipes);

  // Build rows of 2 for the grid
  const rows = useMemo(() => {
    const result: Recipe[][] = [];
    for (let i = 0; i < filteredRecipes.length; i += 2) {
      result.push(filteredRecipes.slice(i, i + 2));
    }
    return result;
  }, [filteredRecipes]);

  const renderRow = ({ item: row }: { item: Recipe[] }) => (
    <View style={styles.row}>
      <RecipeCard recipe={row[0]} />
      {row[1] ? <RecipeCard recipe={row[1]} /> : <View style={{ flex: 1 }} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AsyncState isLoading={isLoading} error={error} onRetry={() => refetch()}>
        <FlatList
          data={rows}
          keyExtractor={(_, index) => String(index)}
          renderItem={renderRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              {/* ── Header ── */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.greeting}>Xin chào, {user?.name ?? 'bạn'} 👋</Text>
                  <Text style={styles.headerTitle}>Hôm nay ăn gì?</Text>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/search')}
                  >
                    <Image source={searchIcon} style={styles.iconImage} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/(app)/user/profile')}
                  >
                    <Image source={userIcon} style={styles.iconImage} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── Banner ── */}
              <View style={styles.banner}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerLabel}>ĐẶC SẮC HÔM NAY</Text>
                  <Text style={styles.bannerTitle}>Khám phá{'\n'}ẩm thực Việt</Text>
                  <TouchableOpacity
                    style={styles.bannerButton}
                    onPress={() => router.push('/search')}
                  >
                    <Text style={styles.bannerButtonText}>Xem tất cả →</Text>
                  </TouchableOpacity>
                </View>
                <Image source={require('../../assets/images/book.png')} style={styles.bannerImage} />
              </View>

              {/* ── Section title + count ── */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Món ngon gợi ý</Text>
                <Text style={styles.sectionCount}>{filteredRecipes.length} món</Text>
              </View>

              {/* ── Category chips ── */}
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                paddingStart={0}
              />

              <View style={styles.divider} />
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>Không có món nào</Text>
              <Text style={styles.emptySubtitle}>
                Chưa có công thức thuộc danh mục "{selectedCategory}"
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: Spacing.md,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerButtonText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginLeft: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  sectionCount: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  divider: {
    height: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
