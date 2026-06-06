import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getRecipes, toggleRecipe, deleteRecipe, Recipe } from '@/services/db';
import { Colors, Typography, Spacing, Radius } from '@/constants/Colors';

type CategoryStyle = {
  bg: string;
  text: string;
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Breakfast: { bg: Colors.categoryBreakfast, text: Colors.categoryBreakfastText },
  Lunch: { bg: Colors.categoryLunch, text: Colors.categoryLunchText },
  Dinner: { bg: Colors.categoryDinner, text: Colors.categoryDinnerText },
  Dessert: { bg: Colors.categoryDessert, text: Colors.categoryDessertText },
};

function RecipeItem({
  item,
  onToggle,
  onDelete,
}: {
  item: Recipe;
  onToggle: (id: number, current: number) => void;
  onDelete: (id: number, title: string) => void;
}) {
  const catStyle = CATEGORY_STYLES[item.category] ?? {
    bg: Colors.surfaceAlt,
    text: Colors.textSecondary,
  };
  const done = item.is_completed === 1;

  return (
    <View style={[styles.card, done && styles.cardDone]}>
      <View style={styles.cardMain}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.badgeText, { color: catStyle.text }]}>
              {item.category}
            </Text>
          </View>
          {done && (
            <View style={styles.cookedBadge}>
              <Text style={styles.cookedBadgeText}>Cooked ✓</Text>
            </View>
          )}
        </View>
        <Text style={[styles.cardTitle, done && styles.cardTitleDone]}>
          {item.title}
        </Text>
        <Text style={styles.cardInstructions} numberOfLines={2}>
          {item.instructions}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, done && styles.actionBtnActive]}
          onPress={() => onToggle(item.id, item.is_completed)}
        >
          <Ionicons
            name={done ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={26}
            color={done ? Colors.success : Colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(item.id, item.title)}
        >
          <Ionicons name="trash-outline" size={22} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ListScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const loadRecipes = useCallback(() => {
    if (Platform.OS !== 'web') {
      setRecipes(getRecipes());
    }
  }, []);

  useFocusEffect(loadRecipes);

  const handleToggle = (id: number, current: number) => {
    toggleRecipe(id, current);
    loadRecipes();
  };

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      'Delete Recipe',
      `Remove "${title}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRecipe(id);
            loadRecipes();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Recipes</Text>
        <Text style={styles.count}>
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item: Recipe) => String(item.id)}
        renderItem={({ item }: { item: Recipe }) => (
          <RecipeItem
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={56} color={Colors.border} />
            <Text style={styles.emptyTitle}>No recipes yet</Text>
            <Text style={styles.emptySubtitle}>
              Head to the Add tab to save your first recipe
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: 64,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize2xl,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  count: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textMuted,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  cardDone: {
    borderColor: Colors.successLight,
    backgroundColor: '#F9FDF9',
  },
  cardMain: {
    flex: 1,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: Typography.fontSizeXs,
    fontWeight: Typography.fontWeightSemibold,
  },
  cookedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.successLight,
  },
  cookedBadgeText: {
    fontSize: Typography.fontSizeXs,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.success,
  },
  cardTitle: {
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardTitleDone: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  cardInstructions: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cardActions: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  actionBtn: {
    padding: Spacing.xs,
  },
  actionBtnActive: {},
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.fontSizeLg,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
