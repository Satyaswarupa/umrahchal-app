import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const STEPS = [
  {
    title: 'Search Your Location',
    description: 'Search your city or tap Near Me to find Umrah agents operating near you.',
    icon: 'location-outline' as const,
  },
  {
    title: 'Review Verified Agents',
    description: "Browse company details for agents that passed UmrahJao's verification.",
    icon: 'shield-checkmark-outline' as const,
  },
  {
    title: 'Contact Directly',
    description: 'Call or message the agent on WhatsApp to discuss your travel plans.',
    icon: 'chatbubbles-outline' as const,
  },
];

export default function HowItWorksScreen() {
  const { colors, edge } = useTheme();

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.base }]} contentContainerStyle={styles.content}>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Finding and booking a trusted Umrah agent on UmrahJao takes just three steps.
      </Text>

      <View style={styles.stepsList}>
        {STEPS.map((step, index) => (
          <View key={step.title} style={[styles.stepCard, { backgroundColor: colors.surface }, edge.raised]}>
            <View style={styles.stepIconWrap}>
              <Ionicons name={step.icon} size={20} color="#fff" />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={[styles.stepNumber, { color: Brand.accent }]}>STEP {index + 1}</Text>
              <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  stepsList: { marginTop: 20, gap: 14 },
  stepCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 16,
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextWrap: { flex: 1 },
  stepNumber: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  stepTitle: { marginTop: 2, fontSize: 15, fontWeight: '700' },
  stepDescription: { marginTop: 4, fontSize: 13, lineHeight: 18 },
});
