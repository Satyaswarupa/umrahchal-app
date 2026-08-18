import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { SERVICES } from '@/constants/services';
import { useTheme } from '@/context/ThemeContext';

export default function ServicesScreen() {
  const { colors, edge } = useTheme();
  const [active, setActive] = useState(SERVICES[0].slug);
  const activeService = SERVICES.find((s) => s.slug === active) ?? SERVICES[0];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Services</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Pick a service to see the verified agents who offer it.
          </Text>
        </View>

        <View style={styles.chipRow}>
          {SERVICES.map((service) => {
            const on = service.slug === active;
            return (
              <Pressable
                key={service.slug}
                onPress={() => setActive(service.slug)}
                style={[
                  styles.chip,
                  on ? styles.chipActive : { backgroundColor: colors.surface },
                  !on && edge.raised,
                ]}>
                <Text style={styles.chipIcon}>{service.icon}</Text>
                <Text style={[styles.chipLabel, { color: on ? Brand.light : colors.text }]}>{service.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.activeCard, edge.raised]}>
          <View style={styles.activeIconWrap}>
            <Text style={styles.activeIcon}>{activeService.icon}</Text>
          </View>
          <View style={styles.activeTextCol}>
            <Text style={styles.activeTitle}>{activeService.label}</Text>
            <Text style={styles.activeBody}>
              Browse UmrahJao agents who offer {activeService.label.toLowerCase()} and reach them directly.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push({ pathname: '/agents', params: { service: active } })}
          style={({ pressed }) => [
            styles.ctaRow,
            { backgroundColor: colors.surface },
            pressed ? edge.pressed : edge.raised,
          ]}>
          <Text style={[styles.ctaText, { color: colors.text }]}>
            See agents offering {activeService.label.toLowerCase()}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.accentText} />
        </Pressable>

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
              <View style={[styles.iconWrap, { backgroundColor: colors.base }, edge.pressed]}>
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
  header: { paddingHorizontal: 20, paddingTop: 68 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 4, fontSize: 13, lineHeight: 19 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginTop: 20 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: Brand.primary },
  chipIcon: { fontSize: 13 },
  chipLabel: { fontSize: 11.5, fontWeight: '800' },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: Brand.primary,
  },
  activeIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: { fontSize: 20 },
  activeTextCol: { flex: 1 },
  activeTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  activeBody: { marginTop: 4, fontSize: 11.5, color: 'rgba(255,255,255,0.75)', lineHeight: 16 },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
  },
  ctaText: { fontSize: 13.5, fontWeight: '800', flex: 1, marginRight: 8 },
  list: { marginTop: 26, paddingHorizontal: 20, gap: 14 },
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
