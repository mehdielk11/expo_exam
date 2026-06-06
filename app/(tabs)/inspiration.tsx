import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/Colors';

type Quote = {
  id: number;
  quote: string;
  author: string;
};

export default function InspirationScreen() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://dummyjson.com/quotes/random');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Quote = await res.json();
      setQuote(data);
    } catch {
      setError('Could not load inspiration. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Daily Inspiration</Text>
          <Text style={styles.subtitle}>
            A fresh perspective to fuel your culinary creativity
          </Text>
        </View>

        {/* Quote Card */}
        <View style={styles.card}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>Fetching inspiration...</Text>
            </View>
          )}

          {!loading && error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="wifi-outline"
                size={40}
                color={Colors.textMuted}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && quote && (
            <View style={styles.quoteContent}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={28}
                color={Colors.accentLight}
                style={styles.quoteIcon}
              />
              <Text style={styles.quoteText}>{quote.quote}</Text>
              <View style={styles.authorRow}>
                <View style={styles.authorDivider} />
                <Text style={styles.authorText}>{quote.author}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          style={[styles.refreshBtn, loading && styles.refreshBtnDisabled]}
          onPress={fetchQuote}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={loading ? Colors.textMuted : '#FFFFFF'}
          />
          <Text
            style={[
              styles.refreshBtnText,
              loading && styles.refreshBtnTextDisabled,
            ]}
          >
            {loading ? 'Loading...' : 'Refresh Inspiration'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>Powered by dummyjson.com</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingTop: 64,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize2xl,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    minHeight: 220,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textMuted,
  },
  errorContainer: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  quoteContent: {
    alignItems: 'flex-start',
  },
  quoteIcon: {
    marginBottom: Spacing.sm,
    opacity: 0.5,
  },
  quoteText: {
    fontSize: Typography.fontSizeLg,
    color: Colors.textPrimary,
    lineHeight: 28,
    fontStyle: 'italic',
    fontWeight: Typography.fontWeightMedium,
    marginBottom: Spacing.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-end',
  },
  authorDivider: {
    width: 24,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  authorText: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.accent,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  refreshBtnDisabled: {
    backgroundColor: Colors.border,
  },
  refreshBtnText: {
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightBold,
    color: '#FFFFFF',
  },
  refreshBtnTextDisabled: {
    color: Colors.textMuted,
  },
  footnote: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSizeXs,
    color: Colors.textMuted,
  },
});
