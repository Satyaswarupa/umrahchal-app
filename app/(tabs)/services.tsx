import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';

const SERVICES = [
  { title: 'Hotel', description: 'Comfortable stays near the Haramain, arranged by your agent.', icon: 'bed-outline' as const },
  { title: 'Transport', description: 'Local transport between cities and holy sites.', icon: 'bus-outline' as const },
  { title: 'Visa Service', description: 'End-to-end assistance with Hajj and Umrah visa paperwork.', icon: 'document-text-outline' as const },
  { title: 'Air Ticket', description: 'Flight booking support for your pilgrimage travel.', icon: 'airplane-outline' as const },
];

export default function ServicesScreen() {
  const { colors, edge } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Services</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Services offered by agents on UmrahChal.</Text>
        </View>

        <View style={styles.list}>
          {SERVICES.map((service) => (
            <View key={service.title} style={[styles.row, { backgroundColor: colors.surface }, edge.raised]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.surface }, edge.pressed]}>
                <Ionicons name={service.icon} size={22} color={colors.accentText} />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{service.title}</Text>
                <Text style={[styles.rowDescription, { color: colors.textMuted }]}>{service.description}</Text>
              </View>
            </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowDescription: { marginTop: 2, fontSize: 12, lineHeight: 17 },
});
