import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const PACKAGES = [
  {
    key: 'hajj',
    title: 'Hajj Package',
    description: 'Complete the annual Hajj pilgrimage with a verified travel agent handling your visa, stay, and transport.',
    icon: 'moon-outline' as const,
  },
  {
    key: 'umrah',
    title: 'Umrah Package',
    description: 'Perform Umrah at any time of the year with a trusted agent guiding your travel and accommodation.',
    icon: 'sparkles-outline' as const,
  },
];

export default function PackagesScreen() {
  const { colors, edge } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Packages</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Choose a package to browse verified agents who offer it.
          </Text>
        </View>

        <View style={styles.list}>
          {PACKAGES.map((pkg) => (
            <Pressable
              key={pkg.key}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface },
                pressed ? edge.pressed : edge.raised,
              ]}
              onPress={() => router.push('/agents')}>
              <View style={styles.iconWrap}>
                <Ionicons name={pkg.icon} size={26} color="#fff" />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{pkg.title}</Text>
                <Text style={[styles.cardDescription, { color: colors.textMuted }]}>{pkg.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 130 },
  header: { paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 4, fontSize: 13, lineHeight: 19 },
  list: { marginTop: 20, paddingHorizontal: 20, gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardDescription: { marginTop: 4, fontSize: 12, lineHeight: 17 },
});
