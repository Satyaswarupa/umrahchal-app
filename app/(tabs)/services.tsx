import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SERVICES } from '@/constants/services';
import { useTheme } from '@/context/ThemeContext';

export default function ServicesScreen() {
  const { colors, edge } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Services</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Tap a service to see verified agents on UmrahChal who offer it.
          </Text>
        </View>

        <View style={styles.list}>
          {SERVICES.map((service) => (
            <Pressable
              key={service.slug}
              onPress={() => router.push({ pathname: '/agents', params: { service: service.slug } })}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: colors.surface },
                pressed ? edge.pressed : edge.raised,
              ]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.surface }, edge.pressed]}>
                <Text style={styles.iconEmoji}>{service.icon}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{service.label}</Text>
                <Text style={[styles.rowDescription, { color: colors.textMuted }]}>
                  See agents offering {service.label.toLowerCase()}.
                </Text>
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
  iconEmoji: { fontSize: 20 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowDescription: { marginTop: 2, fontSize: 12, lineHeight: 17 },
});
