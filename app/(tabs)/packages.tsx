import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const PACKAGES = [
  {
    key: 'hajj',
    badge: 'ANNUAL PILGRIMAGE',
    title: 'Hajj Package',
    description: 'Complete the annual Hajj pilgrimage with a verified travel agent handling your visa, stay, and transport.',
    icon: 'moon-outline' as const,
    facts: [
      { k: 'VISA', v: 'Handled' },
      { k: 'STAY', v: 'Makkah + Madinah' },
      { k: 'GUIDE', v: 'Included' },
    ],
  },
  {
    key: 'umrah',
    badge: 'ANY TIME OF YEAR',
    title: 'Umrah Package',
    description: 'Perform Umrah at any time of the year with a trusted agent guiding your travel and accommodation.',
    icon: 'sparkles-outline' as const,
    facts: [
      { k: 'VISA', v: 'Handled' },
      { k: 'FLIGHTS', v: 'Group fares' },
      { k: 'HOTEL', v: 'Near Haram' },
    ],
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
            Hajj and Umrah packages from verified agents on UmrahJao.
          </Text>
        </View>

        <View style={styles.list}>
          {PACKAGES.map((pkg) => (
            <View key={pkg.key} style={[styles.card, { backgroundColor: colors.surface }, edge.raised]}>
              <LinearGradient
                colors={[Brand.primary, Brand.darkest]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardBanner}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{pkg.badge}</Text>
                </View>
                <View style={styles.bannerBottom}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={pkg.icon} size={22} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>{pkg.title}</Text>
                </View>
              </LinearGradient>

              <View style={styles.cardBody}>
                <Text style={[styles.cardDescription, { color: colors.textMuted }]}>{pkg.description}</Text>

                <View style={styles.factsRow}>
                  {pkg.facts.map((f) => (
                    <View key={f.k} style={[styles.factCell, { backgroundColor: colors.base }, edge.pressed]}>
                      <Text style={[styles.factValue, { color: colors.accentText }]}>{f.v}</Text>
                      <Text style={[styles.factKey, { color: colors.textMuted }]}>{f.k}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.viewButton,
                    { backgroundColor: colors.base },
                    pressed ? edge.pressed : edge.raised,
                  ]}
                  onPress={() => router.push('/agents')}>
                  <Text style={[styles.viewButtonText, { color: colors.accentText }]}>View agents</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.accentText} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={[Brand.primary, Brand.darkest]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.promoCard, edge.raised]}>
          <Text style={styles.promoTitle}>Are you an Umrah travel agent?</Text>
          <Text style={styles.promoBody}>
            Register your company on UmrahJao to reach pilgrims searching for trusted agents in
            your city.
          </Text>
          <Button
            label="List your Business for FREE"
            variant="outline"
            style={styles.promoButton}
            onPress={() => Linking.openURL('https://umrahjao.vercel.app/admin/signup')}
          />
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 130 },
  header: { paddingHorizontal: 20, paddingTop: 68 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 4, fontSize: 13, lineHeight: 19 },
  list: { marginTop: 20, paddingHorizontal: 20, gap: 18 },
  card: { borderRadius: 24, overflow: 'hidden' },
  cardBanner: { padding: 16, minHeight: 108, justifyContent: 'space-between' },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: Brand.light,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.6, color: '#22160A' },
  bannerBottom: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  cardBody: { padding: 16 },
  cardDescription: { fontSize: 13, lineHeight: 19 },
  factsRow: { flexDirection: 'row', gap: 9, marginTop: 14 },
  factCell: { flex: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 6, alignItems: 'center' },
  factValue: { fontSize: 12.5, fontWeight: '800', textAlign: 'center' },
  factKey: { marginTop: 3, fontSize: 9, fontWeight: '700', textAlign: 'center' },
  viewButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewButtonText: { fontSize: 13.5, fontWeight: '800' },
  promoCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 22,
    overflow: 'hidden',
  },
  promoTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  promoBody: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 6, lineHeight: 19 },
  promoButton: { marginTop: 16, backgroundColor: '#fff' },
});
