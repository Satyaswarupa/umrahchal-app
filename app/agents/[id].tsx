import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api, ApiError } from '@/lib/api';
import { toTelLink, toWhatsappLink } from '@/lib/contact-links';
import type { AgentDetail } from '@/types';

function promptLogin() {
  Alert.alert('Please sign up or login', 'Create a free account to call or WhatsApp this agent.', [
    { text: 'Not now', style: 'cancel' },
    { text: 'Log In', onPress: () => router.push('/profile') },
  ]);
}

export default function AgentDetailScreen() {
  const { colors, edge } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<{ agent: AgentDetail }>(`/api/agents/${id}`);
        if (!cancelled) setAgent(data.agent);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not load this agent.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.base }]}>
        <ActivityIndicator color={colors.accentText} size="large" />
      </View>
    );
  }

  if (error || !agent) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.base }]}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.textMuted} />
        <Text style={[styles.errorText, { color: colors.textMuted }]}>{error ?? 'Agent not found.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.base }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.text }]}>{agent.companyName}</Text>
        <VerifiedBadge />
      </View>
      <Text style={[styles.location, { color: colors.textMuted }]}>
        {[agent.city, agent.state, agent.country].filter(Boolean).join(', ')}
      </Text>

      {!!agent.description && (
        <Text style={[styles.description, { color: colors.textMuted }]}>{agent.description}</Text>
      )}

      <View style={[styles.detailsCard, { backgroundColor: colors.surface }, edge.raised]}>
        {!!agent.ownerName && <DetailRow label="Contact Person" value={agent.ownerName} />}
        <DetailRow label="Mobile" value={agent.mobileNumber} />
        <DetailRow label="WhatsApp" value={agent.whatsappNumber} />
        {!!agent.address && <DetailRow label="Address" value={agent.address} last />}
      </View>

      <View style={styles.actions}>
        <Button
          label="Call Now"
          onPress={() => (user ? Linking.openURL(toTelLink(agent.mobileNumber)) : promptLogin())}
          style={[styles.actionButton, !user && styles.actionButtonDisabled]}
        />
        <Button
          label="WhatsApp"
          variant="whatsapp"
          onPress={() =>
            user ? Linking.openURL(toWhatsappLink(agent.whatsappNumber, agent.companyName)) : promptLogin()
          }
          style={[styles.actionButton, !user && styles.actionButtonDisabled]}
        />
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.detailRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
      <Text style={[styles.detailLabel, { color: Brand.accent }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  errorText: { fontSize: 13 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  name: { flex: 1, fontSize: 22, fontWeight: '800' },
  location: { marginTop: 4, fontSize: 13 },
  description: { marginTop: 16, fontSize: 14, lineHeight: 20 },
  detailsCard: {
    marginTop: 20,
    borderRadius: 16,
  },
  detailRow: { paddingHorizontal: 16, paddingVertical: 12 },
  detailLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  detailValue: { marginTop: 4, fontSize: 14 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  actionButton: { flex: 1 },
  actionButtonDisabled: { opacity: 0.4 },
});
