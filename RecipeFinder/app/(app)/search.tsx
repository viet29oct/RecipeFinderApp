import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { RecipeCardWide } from '@/components/recipe/RecipeCard';
import { AsyncState } from '@/components/ui/AsyncState';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useRecipeSearch } from '@/hooks/queries';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const { data: results = [], isLoading, error, refetch } = useRecipeSearch(query);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Search input ── */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm món ăn, nguyên liệu..."
          placeholderTextColor={Colors.textMuted}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Result meta ── */}
      <View style={styles.resultsMeta}>
        <Text style={styles.resultsText}>
          {query.trim() ? (
            <>
              Tìm thấy{' '}
              <Text style={styles.resultsCount}>{results.length}</Text>
              {' '}kết quả cho "
              <Text style={styles.queryText}>{query}</Text>"
            </>
          ) : (
            <>
              <Text style={styles.resultsCount}>{results.length}</Text> món ăn
            </>
          )}
        </Text>
      </View>

      {/* ── Results list ── */}
      <AsyncState isLoading={isLoading} error={error} onRetry={() => refetch()}>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <RecipeCardWide recipe={item} />
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
              <Text style={styles.emptySubtitle}>
                Thử tìm kiếm với từ khóa khác như "phở", "bún", "gà"...
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
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
  backText: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  clearText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  resultsMeta: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  resultsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resultsCount: {
    color: Colors.primary,
    fontWeight: '700',
  },
  queryText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  cardWrapper: {
    marginBottom: Spacing.xs,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
