import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Hero image ── */}
      <View style={styles.imageSection}>
        <Image
          source={require('../../assets/images/stir-fry.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* ── Content ── */}
      <View style={styles.content}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/images/book.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.appName}>RecipeFinder</Text>
        </View>

        <Text style={styles.headline}>Kho công thức{'\n'}ẩm thực Việt 🇻🇳</Text>

        <Text style={styles.description}>
          Khám phá hàng trăm món ngon, lưu lại yêu thích và tự tay tạo công thức của riêng bạn.
        </Text>

        {/* Feature pills */}
        <View style={styles.pills}>
          {['🔍 Tìm kiếm dễ dàng', '❤️ Lưu món yêu thích', '✏️ Tạo công thức riêng'].map(
            (item) => (
              <View key={item} style={styles.pill}>
                <Text style={styles.pillText}>{item}</Text>
              </View>
            )
          )}
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Bắt đầu ngay →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.secondaryBtnText}>
            Chưa có tài khoản?{' '}
            <Text style={styles.secondaryBtnHighlight}>Đăng ký miễn phí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageSection: {
    width: '100%',
    height: height * 0.38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  heroImage: {
    width: width * 0.8,
    height: '90%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  logoIcon: {
    width: 28,
    height: 28,
  },
  appName: {
    ...Typography.bodyBold,
    color: Colors.primary,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 38,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  pill: {
    backgroundColor: Colors.primary + '14',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  pillText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    ...Typography.bodyBold,
    color: '#fff',
    fontSize: 16,
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  secondaryBtnText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  secondaryBtnHighlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
