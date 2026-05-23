import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  /** Extra left padding — set to 0 when already inside a padded container */
  paddingStart?: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Tất cả': '🍽️',
  'Món nước': '🍜',
  'Cơm': '🍚',
  'Nướng': '🔥',
  'Tráng miệng': '🍰',
  'Món xào': '🥘',
  'Gỏi / Salad': '🥗',
  'Món hấp': '♨️',
};

function getEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '🍴';
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  paddingStart = Spacing.lg,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingLeft: paddingStart }]}
    >
      {categories.map((cat) => {
        const isActive = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.75}
          >
            <Text style={styles.emoji}>{getEmoji(cat)}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: Spacing.lg,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    ...Typography.label,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
