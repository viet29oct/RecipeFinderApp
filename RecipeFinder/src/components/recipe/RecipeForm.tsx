import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import type { CreateRecipeInput } from '@/types/recipe';

const CATEGORIES = ['Món nước', 'Cơm', 'Nướng', 'Tráng miệng', 'Chiên', 'Hấp', 'Salad', 'Khác'];

interface Props {
  initial?: Partial<CreateRecipeInput>;
  onSubmit: (data: CreateRecipeInput) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function RecipeForm({ initial, onSubmit, isLoading, submitLabel = 'Lưu món' }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [timeLabel, setTimeLabel] = useState(initial?.timeLabel ?? '');
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients?.length ? initial.ingredients : ['']
  );
  const [steps, setSteps] = useState<string[]>(
    initial?.steps?.length ? initial.steps : ['']
  );

  // ── Dynamic list helpers ────────────────────────────────────────────────────

  const updateItem = (
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    value: string
  ) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const addItem = (list: string[], setList: (v: string[]) => void) => setList([...list, '']);

  const removeItem = (list: string[], setList: (v: string[]) => void, index: number) => {
    if (list.length <= 1) return; // keep at least 1
    setList(list.filter((_, i) => i !== index));
  };

  // ── Validation + submit ─────────────────────────────────────────────────────

  const handleSubmit = () => {
    const cleanIngredients = ingredients.map((s) => s.trim()).filter(Boolean);
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);

    if (!name.trim()) return Alert.alert('Thiếu tên', 'Vui lòng nhập tên món ăn.');
    if (!timeLabel.trim()) return Alert.alert('Thiếu thời gian', 'Vui lòng nhập thời gian nấu.');
    if (!cleanIngredients.length)
      return Alert.alert('Thiếu nguyên liệu', 'Vui lòng nhập ít nhất 1 nguyên liệu.');
    if (!cleanSteps.length)
      return Alert.alert('Thiếu bước làm', 'Vui lòng nhập ít nhất 1 bước làm.');

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      category,
      timeLabel: timeLabel.trim(),
      ingredients: cleanIngredients,
      steps: cleanSteps,
    });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name */}
        <Text style={styles.label}>Tên món *</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Phở bò"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
          maxLength={255}
        />

        {/* Category */}
        <Text style={styles.label}>Danh mục *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time */}
        <Text style={styles.label}>Thời gian nấu *</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: 30 phút"
          placeholderTextColor={Colors.textMuted}
          value={timeLabel}
          onChangeText={setTimeLabel}
          maxLength={50}
        />

        {/* Description */}
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Mô tả ngắn về món ăn..."
          placeholderTextColor={Colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          maxLength={2000}
          textAlignVertical="top"
        />

        {/* Image URL */}
        <Text style={styles.label}>URL ảnh (tuỳ chọn)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={Colors.textMuted}
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
          keyboardType="url"
          maxLength={1024}
        />

        {/* Ingredients */}
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Nguyên liệu *</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addItem(ingredients, setIngredients)}
          >
            <Text style={styles.addBtnText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.listRow}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>{index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, styles.listInput]}
              placeholder={`Nguyên liệu ${index + 1}`}
              placeholderTextColor={Colors.textMuted}
              value={item}
              onChangeText={(v) => updateItem(ingredients, setIngredients, index, v)}
            />
            {ingredients.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(ingredients, setIngredients, index)}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Steps */}
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Các bước làm *</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addItem(steps, setSteps)}
          >
            <Text style={styles.addBtnText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>
        {steps.map((step, index) => (
          <View key={index} style={styles.listRow}>
            <View style={[styles.bullet, styles.stepBullet]}>
              <Text style={styles.bulletText}>{index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, styles.listInput, styles.multiline]}
              placeholder={`Bước ${index + 1}...`}
              placeholderTextColor={Colors.textMuted}
              value={step}
              onChangeText={(v) => updateItem(steps, setSteps, index, v)}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
            {steps.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(steps, setSteps, index)}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{submitLabel}</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  multiline: {
    minHeight: 80,
    paddingTop: Spacing.sm,
  },
  chipScroll: { marginBottom: Spacing.xs },
  chipRow: { gap: Spacing.xs, paddingRight: Spacing.lg },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { ...Typography.label, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  addBtn: {
    backgroundColor: Colors.primary + '18',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  addBtnText: { ...Typography.label, color: Colors.primary, fontWeight: '700' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexShrink: 0,
  },
  stepBullet: { backgroundColor: Colors.primary, marginTop: 10 },
  bulletText: { ...Typography.label, color: Colors.primary, fontWeight: '700', fontSize: 11 },
  listInput: { flex: 1, marginBottom: 0 },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexShrink: 0,
  },
  removeBtnText: { color: Colors.error, fontSize: 12, fontWeight: '700' },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { ...Typography.bodyBold, color: '#fff', fontSize: 16 },
});
