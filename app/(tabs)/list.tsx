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
  Modal,
  ScrollView,
  TextInput,
  ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  getRecipes,
  toggleRecipe,
  deleteRecipe,
  updateRecipe,
  Recipe,
} from '@/services/db';
import { Colors, Typography, Spacing, Radius } from '@/constants/Colors';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'] as const;
type Category = (typeof CATEGORIES)[number];

type CategoryStyle = { bg: string; text: string };

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Breakfast: { bg: Colors.categoryBreakfast, text: Colors.categoryBreakfastText },
  Lunch:     { bg: Colors.categoryLunch,     text: Colors.categoryLunchText },
  Dinner:    { bg: Colors.categoryDinner,    text: Colors.categoryDinnerText },
  Dessert:   { bg: Colors.categoryDessert,   text: Colors.categoryDessertText },
};

type CatFilter = 'All' | Category;
type StatusFilter = 'All' | 'Cooked' | 'Uncooked';

const CAT_OPTIONS: CatFilter[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
const STATUS_OPTIONS: StatusFilter[] = ['All', 'Cooked', 'Uncooked'];

// ─── List Row ────────────────────────────────────────────────────────────────

function RecipeItem({
  item,
  onPress,
}: {
  item: Recipe;
  onPress: (item: Recipe) => void;
}) {
  const catStyle = CATEGORY_STYLES[item.category] ?? {
    bg: Colors.surfaceAlt,
    text: Colors.textSecondary,
  };
  const done = item.is_completed === 1;

  return (
    <TouchableOpacity
      style={[styles.card, done && styles.cardDone]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      <View style={styles.cardMain}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.badgeText, { color: catStyle.text }]}>
              {item.category}
            </Text>
          </View>
          {done && (
            <View style={styles.cookedBadge}>
              <Text style={styles.cookedBadgeText}>Cooked</Text>
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
      <View style={styles.cardChevron}>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  recipe,
  onClose,
  onRefresh,
}: {
  recipe: Recipe;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(recipe.title);
  const [editInstructions, setEditInstructions] = useState(recipe.instructions);
  const [editCategory, setEditCategory] = useState<Category>(
    recipe.category as Category
  );

  const catStyle = CATEGORY_STYLES[recipe.category] ?? {
    bg: Colors.surfaceAlt,
    text: Colors.textSecondary,
  };
  const done = recipe.is_completed === 1;

  // ── actions ──────────────────────────────────────────────────────────────

  const handleToggle = () => {
    toggleRecipe(recipe.id, recipe.is_completed);
    onRefresh();
    onClose();
  };

  const handleDelete = () => {
    // Alert.alert is a no-op on web — use window.confirm instead
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      if (window.confirm(`Remove "${recipe.title}" from your collection?`)) {
        deleteRecipe(recipe.id);
        onRefresh();
        onClose();
      }
      return;
    }
    Alert.alert(
      'Delete Recipe',
      `Remove "${recipe.title}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRecipe(recipe.id);
            onRefresh();
            onClose();
          },
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    if (editTitle.trim().length === 0 || editInstructions.trim().length === 0) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        window.alert('Title and instructions are required.');
      } else {
        Alert.alert('Missing Fields', 'Title and instructions are required.', [
          { text: 'OK' },
        ]);
      }
      return;
    }
    updateRecipe(
      recipe.id,
      editTitle.trim(),
      editInstructions.trim(),
      editCategory
    );
    onRefresh();
    setEditing(false);
    onClose();
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditTitle(recipe.title);
    setEditInstructions(recipe.instructions);
    setEditCategory(recipe.category as Category);
  };

  const handlePickCategory = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', ...CATEGORIES],
        cancelButtonIndex: 0,
        title: 'Select Category',
      },
      (idx) => {
        if (idx > 0) setEditCategory(CATEGORIES[idx - 1]);
      }
    );
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={editing ? cancelEdit : onClose}
    >
      <View style={modal.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

        {/* Top bar */}
        <View style={modal.topBar}>
          {/* Left: close / back */}
          <TouchableOpacity
            style={modal.topSideBtn}
            onPress={editing ? cancelEdit : onClose}
            hitSlop={10}
          >
            {editing ? (
              <Text style={modal.topCancelText}>Cancel</Text>
            ) : (
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            )}
          </TouchableOpacity>

          {/* Centre title */}
          <Text style={modal.topTitle} numberOfLines={1}>
            {editing ? 'Edit Recipe' : 'Recipe Detail'}
          </Text>

          {/* Right: spacer keeps title centred */}
          <View style={modal.topSideBtn} />
        </View>

        <ScrollView
          contentContainerStyle={modal.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── VIEW MODE ─────────────────────────────────────────────── */}
          {!editing && (
            <>
              <View style={modal.metaRow}>
                <View style={[modal.badge, { backgroundColor: catStyle.bg }]}>
                  <Text style={[modal.badgeText, { color: catStyle.text }]}>
                    {recipe.category}
                  </Text>
                </View>
                {done && (
                  <View
                    style={[modal.badge, { backgroundColor: Colors.successLight }]}
                  >
                    <Text style={[modal.badgeText, { color: Colors.success }]}>
                      Cooked
                    </Text>
                  </View>
                )}
              </View>

              <Text style={modal.recipeTitle}>{recipe.title}</Text>

              <View style={modal.divider} />

              <Text style={modal.sectionLabel}>Instructions</Text>
              <Text style={modal.recipeBody}>{recipe.instructions}</Text>
            </>
          )}

          {/* ── EDIT MODE ─────────────────────────────────────────────── */}
          {editing && (
            <>
              <View style={modal.fieldGroup}>
                <Text style={modal.label}>Recipe Name *</Text>
                <TextInput
                  style={modal.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Recipe name"
                  placeholderTextColor={Colors.textMuted}
                  autoFocus
                />
              </View>

              <View style={modal.fieldGroup}>
                <Text style={modal.label}>Category</Text>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={modal.input}
                    onPress={handlePickCategory}
                    activeOpacity={0.7}
                  >
                    <View style={modal.iosRow}>
                      <Text style={modal.inputText}>{editCategory}</Text>
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color={Colors.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={modal.pickerWrapper}>
                    <Picker
                      selectedValue={editCategory}
                      onValueChange={(v: Category) => setEditCategory(v)}
                      style={modal.picker}
                      dropdownIconColor={Colors.textSecondary}
                    >
                      {CATEGORIES.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>

              <View style={modal.fieldGroup}>
                <Text style={modal.label}>Instructions *</Text>
                <TextInput
                  style={[modal.input, modal.textArea]}
                  value={editInstructions}
                  onChangeText={setEditInstructions}
                  placeholder="Describe how to prepare this recipe..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={modal.saveBtn}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={modal.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* ── BOTTOM ACTION BAR (view mode only) ─────────────────────── */}
        {!editing && (
          <View style={modal.bottomBar}>
            {/* Edit — primary, filled accent */}
            <TouchableOpacity
              style={modal.editActionBtn}
              onPress={() => setEditing(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={19} color="#fff" />
              <Text style={modal.editActionBtnText}>Edit</Text>
            </TouchableOpacity>

            {/* Mark Cooked — outlined success */}
            <TouchableOpacity
              style={[modal.cookBtn, done && modal.cookBtnActive]}
              onPress={handleToggle}
              activeOpacity={0.8}
            >
              <Ionicons
                name={done ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={19}
                color={done ? Colors.surface : Colors.success}
              />
              <Text style={[modal.cookBtnText, done && modal.cookBtnTextActive]}>
                {done ? 'Uncooked' : 'Cooked'}
              </Text>
            </TouchableOpacity>

            {/* Delete — outlined danger */}
            <TouchableOpacity
              style={modal.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={19} color={Colors.danger} />
              <Text style={modal.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ─── Filter Dropdown ───────────────────────────────────────────────────────────

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = value !== 'All';

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', ...options], cancelButtonIndex: 0, title: label },
        (idx) => { if (idx > 0) onChange(options[idx - 1]); }
      );
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[filt.pill, isActive && filt.pillActive]}
        onPress={handlePress}
        activeOpacity={0.75}
      >
        <Text style={[filt.pillLabel, isActive && filt.pillLabelActive]}>
          {label}:
        </Text>
        <Text style={[filt.pillValue, isActive && filt.pillValueActive]}>
          {value}
        </Text>
        <Ionicons
          name="chevron-down"
          size={13}
          color={isActive ? Colors.accent : Colors.textMuted}
        />
      </TouchableOpacity>

      {/* Web / Android option sheet */}
      {open && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <TouchableOpacity
            style={filt.overlay}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          >
            <View style={filt.sheet}>
              <Text style={filt.sheetTitle}>{label}</Text>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    filt.sheetRow,
                    opt === value && filt.sheetRowActive,
                  ]}
                  onPress={() => { onChange(opt); setOpen(false); }}
                >
                  <Text
                    style={[
                      filt.sheetRowText,
                      opt === value && filt.sheetRowTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {opt === value && (
                    <Ionicons name="checkmark" size={16} color={Colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ListScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [catFilter, setCatFilter] = useState<CatFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const loadRecipes = useCallback(() => {
    setRecipes(getRecipes());
  }, []);

  useFocusEffect(loadRecipes);

  const filtered = recipes.filter((r) => {
    const catOk = catFilter === 'All' || r.category === catFilter;
    const statusOk =
      statusFilter === 'All' ||
      (statusFilter === 'Cooked'   && r.is_completed === 1) ||
      (statusFilter === 'Uncooked' && r.is_completed === 0);
    return catOk && statusOk;
  });

  const hasActiveFilter = catFilter !== 'All' || statusFilter !== 'All';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Recipes</Text>
        <Text style={styles.count}>
          {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <View style={styles.filterPills}>
          <FilterDropdown<CatFilter>
            label="Category"
            value={catFilter}
            options={CAT_OPTIONS}
            onChange={setCatFilter}
          />
          <FilterDropdown<StatusFilter>
            label="Status"
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={setStatusFilter}
          />
        </View>
        {hasActiveFilter && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => { setCatFilter('All'); setStatusFilter('All'); }}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item: Recipe) => String(item.id)}
        renderItem={({ item }: { item: Recipe }) => (
          <RecipeItem item={item} onPress={setSelected} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={56} color={Colors.border} />
            <Text style={styles.emptyTitle}>
              {hasActiveFilter ? 'No matching recipes' : 'No recipes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {hasActiveFilter
                ? 'Try adjusting your filters'
                : 'Head to the Add tab to save your first recipe'}
            </Text>
          </View>
        }
      />

      {selected && (
        <DetailModal
          recipe={selected}
          onClose={() => setSelected(null)}
          onRefresh={loadRecipes}
        />
      )}
    </View>
  );
}

// ─── Styles: List ─────────────────────────────────────────────────────────────

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
    alignItems: 'center',
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
  cardChevron: {
    paddingHorizontal: Spacing.sm,
  },
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
  // filter row
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterPills: {
    flexShrink: 1,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    marginLeft: Spacing.xs,
  },
  clearBtnText: {
    fontSize: Typography.fontSizeXs,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeightMedium,
  },
});

// ─── Styles: Modal ────────────────────────────────────────────────────────────

const modal = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── top bar ────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 16 : 48,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  topSideBtn: {
    minWidth: 60,       // equal width on both sides keeps title truly centred
    alignItems: 'flex-start',
    padding: Spacing.xs,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textPrimary,
  },
  topCancelText: {
    fontSize: Typography.fontSizeSm,
    color: Colors.accent,
    fontWeight: Typography.fontWeightMedium,
  },

  // ── scroll content ─────────────────────────────────────────────────────
  scroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // ── view mode ──────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: Typography.fontSizeXs,
    fontWeight: Typography.fontWeightSemibold,
  },
  recipeTitle: {
    fontSize: Typography.fontSize2xl,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.fontSizeXs,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  recipeBody: {
    fontSize: Typography.fontSizeBase,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // ── edit mode ──────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Typography.fontSizeBase,
    color: Colors.textPrimary,
  },
  inputText: {
    fontSize: Typography.fontSizeBase,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 140,
    paddingTop: 12,
  },
  iosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerWrapper: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.textPrimary,
    height: 52,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 16,
    marginTop: Spacing.sm,
  },
  saveBtnText: {
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightBold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // ── bottom action bar ──────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 32 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  // Edit — filled accent, most prominent
  editActionBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
  },
  editActionBtnText: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightBold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Cooked — outlined success
  cookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.success,
    backgroundColor: Colors.surface,
  },
  cookBtnActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  cookBtnText: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.success,
  },
  cookBtnTextActive: {
    color: Colors.surface,
  },

  // Delete — outlined danger
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    backgroundColor: Colors.surface,
  },
  deleteBtnText: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.danger,
  },
});

// ─── Styles: Filter Dropdown ──────────────────────────────────────────────────

const filt = StyleSheet.create({
  // trigger pill
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    borderColor: Colors.accentLight,
    backgroundColor: Colors.accentLight,
  },
  pillLabel: {
    fontSize: Typography.fontSizeXs,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.textMuted,
  },
  pillLabelActive: {
    color: Colors.accentDark,
  },
  pillValue: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textPrimary,
  },
  pillValueActive: {
    color: Colors.accent,
  },
  // overlay + sheet (web / Android)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sheetTitle: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
  },
  sheetRowActive: {
    backgroundColor: Colors.accentLight,
  },
  sheetRowText: {
    fontSize: Typography.fontSizeBase,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeightMedium,
  },
  sheetRowTextActive: {
    color: Colors.accent,
    fontWeight: Typography.fontWeightSemibold,
  },
});

