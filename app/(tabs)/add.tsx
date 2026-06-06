import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
  ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { insertRecipe } from '@/services/db';
import { Colors, Typography, Spacing, Radius } from '@/constants/Colors';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'] as const;
type Category = (typeof CATEGORIES)[number];

export default function AddScreen() {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState<Category>('Breakfast');
  const [titleFocused, setTitleFocused] = useState(false);
  const [instructionsFocused, setInstructionsFocused] = useState(false);

  const handleSubmit = () => {
    if (title.trim().length === 0 || instructions.trim().length === 0) {
      Alert.alert(
        'Missing Fields',
        'Title and instructions are required before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    insertRecipe(title.trim(), instructions.trim(), category);

    Alert.alert('Recipe Saved', `"${title.trim()}" has been added to your collection.`, [
      { text: 'OK' },
    ]);

    // Reset form
    setTitle('');
    setInstructions('');
    setCategory('Breakfast');
  };

  const handlePressCategory = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', ...CATEGORIES],
        cancelButtonIndex: 0,
        title: 'Select Category',
      },
      (buttonIndex) => {
        if (buttonIndex > 0) {
          setCategory(CATEGORIES[buttonIndex - 1]);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New Recipe</Text>
          <Text style={styles.subtitle}>
            Add a new culinary idea to your collection
          </Text>
        </View>

        {/* Title Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Recipe Name *</Text>
          <TextInput
            style={[
              styles.input,
              titleFocused && styles.inputFocused,
            ]}
            placeholder="e.g. Creamy Mushroom Risotto"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            returnKeyType="next"
          />
        </View>

        {/* Category Picker */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.input}
              onPress={handlePressCategory}
              activeOpacity={0.7}
            >
              <View style={styles.iosPickerContent}>
                <Text style={styles.pickerText}>{category}</Text>
                <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={(value: Category) => setCategory(value)}
                style={styles.picker}
                dropdownIconColor={Colors.textSecondary}
              >
                {CATEGORIES.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Instructions Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Instructions *</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              instructionsFocused && styles.inputFocused,
            ]}
            placeholder="Describe how to prepare this recipe..."
            placeholderTextColor={Colors.textMuted}
            value={instructions}
            onChangeText={setInstructions}
            onFocus={() => setInstructionsFocused(true)}
            onBlur={() => setInstructionsFocused(false)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Required note */}
        <Text style={styles.requiredNote}>* Required fields</Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>Save Recipe</Text>
        </TouchableOpacity>
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
  },
  header: {
    marginBottom: Spacing.xl,
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
  },
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
  inputFocused: {
    borderColor: Colors.borderFocus,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
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
  iosPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: Typography.fontSizeBase,
    color: Colors.textPrimary,
  },
  requiredNote: {
    fontSize: Typography.fontSizeXs,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnText: {
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightBold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
