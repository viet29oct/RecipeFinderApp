import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import type { Recipe } from '@/types/recipe';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.sm) / 2;

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isSaved, toggleSaved } = useSavedRecipes();
  const saved = isSaved(recipe.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/food/${recipe.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{recipe.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(event) => {
          event.stopPropagation();
          toggleSaved(recipe.id);
        }}
      >
        <Ionicons
          name={saved ? 'heart' : 'heart-outline'}
          size={18}
          color={saved ? Colors.error : Colors.textSecondary}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {recipe.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.time}>⏱ {recipe.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function RecipeCardWide({ recipe }: RecipeCardProps) {
  const { isSaved, toggleSaved } = useSavedRecipes();
  const saved = isSaved(recipe.id);

  return (
    <TouchableOpacity
      style={styles.wideCard}
      onPress={() => router.push(`/food/${recipe.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: recipe.image }} style={styles.wideImage} resizeMode="cover" />
      <View style={styles.wideContent}>
        <TouchableOpacity
          style={styles.favoriteButtonWide}
          onPress={(event) => {
            event.stopPropagation();
            toggleSaved(recipe.id);
          }}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>
        <View style={styles.wideBadge}>
          <Text style={styles.badgeText}>{recipe.category}</Text>
        </View>
        <Text style={styles.wideName} numberOfLines={2}>
          {recipe.name}
        </Text>
        <Text style={styles.wideDescription} numberOfLines={2}>
          {recipe.description}
        </Text>
        <Text style={styles.wideTime}>⏱ {recipe.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: Spacing.sm,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.border,
  },
  badge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...Typography.label,
    color: '#FFFFFF',
    fontSize: 10,
  },
  content: {
    padding: Spacing.sm,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontSize: 14,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  wideCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: Spacing.sm,
  },
  wideImage: {
    width: 110,
    height: 110,
    backgroundColor: Colors.border,
  },
  wideContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'center',
  },
  favoriteButtonWide: {
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.sm,
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  wideBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
  },
  wideName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  wideDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  wideTime: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});
