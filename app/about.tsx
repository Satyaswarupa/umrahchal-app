import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { toTelLink } from '@/lib/contact-links';

const WHY_US = [
  { title: 'Verified Agents', icon: 'shield-checkmark-outline' as const },
  { title: 'Reliability', icon: 'ribbon-outline' as const },
  { title: '24/7 Support', icon: 'headset-outline' as const },
  { title: 'Package Guidance', icon: 'compass-outline' as const },
];

const PHONE = '8810337079';
const EMAIL = 'support.umrahnoor786@gmail.com';
const WEBSITE = 'https://umrahnoor.vercel.app/';

export default function AboutScreen() {
  const { colors, edge } = useTheme();

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.base }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: colors.text }]}>Our Mission</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        UmrahChal connects pilgrims with verified, trustworthy Umrah travel agents across India,
        making it simple and safe to plan a meaningful journey — with transparent, direct
        communication and no hidden middlemen.
      </Text>

      <Text style={[styles.heading, styles.sectionSpacing, { color: colors.text }]}>Why Choose Us?</Text>
      <View style={styles.grid}>
        {WHY_US.map((item) => (
          <View key={item.title} style={[styles.gridItem, { backgroundColor: colors.surface }, edge.raised]}>
            <View style={styles.gridIconWrap}>
              <Ionicons name={item.icon} size={22} color="#fff" />
            </View>
            <Text style={[styles.gridLabel, { color: colors.text }]}>{item.title}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.heading, styles.sectionSpacing, { color: colors.text }]}>Get in Touch</Text>
      <View style={styles.contactList}>
        <ContactRow
          icon="call-outline"
          label="Mobile"
          value={PHONE}
          onPress={() => Linking.openURL(toTelLink(PHONE))}
        />
        <ContactRow
          icon="mail-outline"
          label="Email"
          value={EMAIL}
          onPress={() => Linking.openURL(`mailto:${EMAIL}`)}
        />
        <ContactRow
          icon="globe-outline"
          label="Official Website"
          value={WEBSITE.replace(/^https?:\/\//, '')}
          onPress={() => Linking.openURL(WEBSITE)}
        />
      </View>
    </ScrollView>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  const { colors, edge } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [styles.contactRow, { backgroundColor: colors.surface }, pressed ? edge.pressed : edge.raised]}
      onPress={onPress}>
      <View style={[styles.contactIconWrap, { backgroundColor: colors.surface }, edge.pressed]}>
        <Ionicons name={icon} size={20} color={colors.accentText} />
      </View>
      <View style={styles.contactText}>
        <Text style={[styles.contactLabel, { color: Brand.accent }]}>{label}</Text>
        <Text style={[styles.contactValue, { color: colors.text }]}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  heading: { fontSize: 18, fontWeight: '800' },
  body: { marginTop: 10, fontSize: 14, lineHeight: 21 },
  sectionSpacing: { marginTop: 32 },
  grid: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  gridIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: { fontSize: 13, fontWeight: '700' },
  contactList: { marginTop: 16, gap: 10 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: { flex: 1 },
  contactLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  contactValue: { marginTop: 2, fontSize: 14 },
});
