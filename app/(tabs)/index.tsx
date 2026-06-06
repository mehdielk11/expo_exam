import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/Colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type ActionCard = {
  icon: IoniconName;
  title: string;
  subtitle: string;
  route: '/(tabs)/add' | '/(tabs)/list' | '/(tabs)/inspiration';
  color: string;
};

const ACTION_CARDS: ActionCard[] = [
  {
    icon: 'add-circle-outline',
    title: 'Add New Recipe',
    subtitle: 'Save a new culinary idea',
    route: '/(tabs)/add',
    color: Colors.accent,
  },
  {
    icon: 'book-outline',
    title: 'View Collection',
    subtitle: 'Browse your saved recipes',
    route: '/(tabs)/list',
    color: Colors.success,
  },
  {
    icon: 'sparkles-outline',
    title: 'Daily Quote',
    subtitle: 'Get inspired to cook',
    route: '/(tabs)/inspiration',
    color: '#B08850', // Premium warm gold-brown
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="flame" size={36} color={Colors.accent} />
          </View>
          <Text style={styles.appTitle}>FlavorCraft</Text>
          <Text style={styles.subtitle}>
            A clean workspace to collect culinary ideas and daily cooking inspiration.
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Quick Actions */}
        <Text style={styles.sectionLabel}>Quick Actions</Text>

        {ACTION_CARDS.map((card) => (
          <TouchableOpacity
            key={card.route}
            style={styles.card}
            onPress={() => router.push(card.route)}
            activeOpacity={0.75}
          >
            <View style={[styles.cardIcon, { backgroundColor: card.color + '18' }]}>
              <Ionicons name={card.icon} size={26} color={card.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        ))}

        {/* Footer note */}
        <Text style={styles.footerNote}>
          All recipes are stored locally on your device.
        </Text>
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
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appTitle: {
    fontSize: Typography.fontSize3xl,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizeBase,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSizeBase,
    fontWeight: Typography.fontWeightSemibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
  },
  footerNote: {
    fontSize: Typography.fontSizeXs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
