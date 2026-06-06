import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/Colors';
import { insertRecipe } from '@/services/db';

type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strInstructions: string;
};

const mapCategory = (apiCategory: string): string => {
  const normalized = (apiCategory || '').trim().toLowerCase();
  if (normalized === 'dessert') return 'Dessert';
  if (normalized === 'breakfast') return 'Breakfast';
  // Map starters, sides, pasta, etc. to Lunch, and main heavy dishes to Dinner
  const lunchCategories = ['starter', 'side', 'salad', 'vegetarian', 'vegan', 'pasta', 'seafood'];
  if (lunchCategories.includes(normalized)) return 'Lunch';
  return 'Dinner'; // Default to Dinner for Beef, Chicken, Pork, Lamb, Miscellaneous, etc.
};

export default function InspirationScreen() {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const fetchMeal = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        const fetchedMeal = data.meals[0];
        setMeal({
          ...fetchedMeal,
          strCategory: mapCategory(fetchedMeal.strCategory),
        });
      } else {
        throw new Error('No meal found');
      }
    } catch {
      setError('Could not load recipe inspiration. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, []);

  const handleSave = () => {
    if (!meal) return;
    try {
      insertRecipe(meal.strMeal, meal.strInstructions, meal.strCategory);
      setSaved(true);
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        window.alert(`"${meal.strMeal}" has been saved to your collection!`);
      } else {
        Alert.alert(
          'Recipe Saved',
          `"${meal.strMeal}" has been added to your recipes list.`,
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        window.alert('Failed to save recipe.');
      } else {
        Alert.alert('Error', 'Failed to save recipe.');
      }
    }
  };

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
          <Text style={styles.title}>Recipe Inspiration</Text>
          <Text style={styles.subtitle}>
            Discover a random recipe to fuel your culinary creativity
          </Text>
        </View>

        {/* Recipe Card */}
        <View style={styles.card}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>Fetching recipe...</Text>
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

          {!loading && !error && meal && (
            <View style={styles.recipeContent}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{meal.strCategory}</Text>
                </View>
              </View>
              
              <Text style={styles.recipeTitle}>{meal.strMeal}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.sectionLabel}>Instructions</Text>
              <Text style={styles.instructionsText}>{meal.strInstructions}</Text>

              <TouchableOpacity
                style={[styles.saveBtn, saved && styles.saveBtnSaved]}
                onPress={handleSave}
                disabled={saved}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={saved ? 'checkmark-circle' : 'bookmark-outline'}
                  size={18}
                  color={saved ? Colors.success : '#FFFFFF'}
                />
                <Text style={[styles.saveBtnText, saved && styles.saveBtnTextSaved]}>
                  {saved ? 'Saved to Recipes' : 'Save to My Recipes'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          style={[styles.refreshBtn, loading && styles.refreshBtnDisabled]}
          onPress={fetchMeal}
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
            {loading ? 'Loading...' : 'Inspire Me Again'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>Powered by themealdb.com</Text>
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
  recipeContent: {
    width: '100%',
    alignItems: 'flex-start',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.categoryBreakfast || '#FDF2E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  categoryText: {
    fontSize: Typography.fontSizeXs,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.categoryBreakfastText || '#D35400',
  },
  recipeTitle: {
    fontSize: Typography.fontSizeLg,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeightBold,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
    marginVertical: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  instructionsText: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
    lineHeight: 20,
    width: '100%',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    width: '100%',
    marginTop: Spacing.md,
  },
  saveBtnSaved: {
    backgroundColor: Colors.successLight,
    borderWidth: 1.5,
    borderColor: Colors.success,
  },
  saveBtnText: {
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightBold,
    color: '#FFFFFF',
  },
  saveBtnTextSaved: {
    color: Colors.success,
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
