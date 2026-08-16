import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { toTelLink, toWhatsappLink } from '@/lib/contact-links';
import type { AgentSummary } from '@/types';
import { VerifiedBadge } from './VerifiedBadge';

export function AgentCard({ agent }: { agent: AgentSummary }) {
  const { colors, edge } = useTheme();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface }, edge.raised]}
      onPress={() => router.push(`/agents/${agent.id}`)}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {agent.companyName}
        </Text>
        <VerifiedBadge />
      </View>

      <Text style={[styles.location, { color: colors.textMuted }]}>
        {agent.city}, {agent.state}
      </Text>

      {!!agent.description && (
        <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
          {agent.description}
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.callButton, edge.raised]}
          onPress={() => Linking.openURL(toTelLink(agent.mobileNumber))}>
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.actionText}>Call</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.whatsappButton, edge.raised]}
          onPress={() => Linking.openURL(toWhatsappLink(agent.whatsappNumber, agent.companyName))}>
          <Ionicons name="logo-whatsapp" size={16} color="#fff" />
          <Text style={styles.actionText}>WhatsApp</Text>
        </Pressable>
      </View>

      <Pressable style={styles.detailsLink} onPress={() => router.push(`/agents/${agent.id}`)}>
        <Text style={[styles.detailsText, { color: colors.accentText }]}>View Details</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.accentText} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: { flex: 1, fontSize: 16, fontWeight: '700' },
  location: { marginTop: 4, fontSize: 13 },
  description: { marginTop: 8, fontSize: 13, lineHeight: 18 },
  actions: { marginTop: 14, flexDirection: 'row', gap: 8 },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callButton: { backgroundColor: Brand.primary },
  whatsappButton: { backgroundColor: Brand.whatsapp },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  detailsLink: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  detailsText: { fontSize: 13, fontWeight: '600' },
});
