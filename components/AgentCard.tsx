import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api, ApiError } from '@/lib/api';
import { toTelLink, toWhatsappLink } from '@/lib/contact-links';
import type { AgentDetail, AgentSummary } from '@/types';
import { VerifiedBadge } from './VerifiedBadge';

function promptLogin() {
  Alert.alert('Please sign up or login', 'Create a free account to call or WhatsApp this agent.', [
    { text: 'Not now', style: 'cancel' },
    { text: 'Log In', onPress: () => router.push('/profile') },
  ]);
}

export function AgentCard({ agent, compact }: { agent: AgentSummary; compact?: boolean }) {
  const { colors, edge } = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<AgentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  function openSheet() {
    setOpen(true);
    if (!detail && !loadingDetail) {
      setLoadingDetail(true);
      setDetailError(null);
      api
        .get<{ agent: AgentDetail }>(`/api/agents/${agent.id}`)
        .then((data) => setDetail(data.agent))
        .catch((err) => setDetailError(err instanceof ApiError ? err.message : 'Could not load full details.'))
        .finally(() => setLoadingDetail(false));
    }
  }

  const shown = detail ?? agent;

  return (
    <>
      <Pressable style={[styles.card, { backgroundColor: colors.surface }, edge.raised]} onPress={openSheet}>
        <View style={[styles.banner, compact && styles.bannerCompact]}>
          {agent.profileImage?.url ? (
            <Image source={{ uri: agent.profileImage.url }} style={styles.bannerImage} />
          ) : (
            <LinearGradient
              colors={['#9A9A9A', '#0D5546']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerImage}>
              <Ionicons name="business" size={compact ? 26 : 36} color="rgba(255,255,255,0.85)" />
            </LinearGradient>
          )}
        </View>

        <View style={[styles.body, compact && styles.bodyCompact]}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.name, compact && styles.nameCompact, { color: colors.text }]}
              numberOfLines={1}>
              {agent.companyName}
            </Text>
            <VerifiedBadge compact={compact} />
          </View>
          <Text style={[styles.location, compact && styles.locationCompact, { color: colors.textMuted }]} numberOfLines={1}>
            {agent.city}, {agent.state}
          </Text>

          {!compact && !!agent.description && (
            <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
              {agent.description}
            </Text>
          )}

          <View style={[styles.actions, compact && styles.actionsCompact]}>
            <Pressable
              style={[
                styles.actionButton,
                compact && styles.actionButtonCompact,
                styles.callButton,
                edge.raised,
                !user && styles.actionButtonDisabled,
              ]}
              onPress={() => (user ? Linking.openURL(toTelLink(agent.mobileNumber)) : promptLogin())}>
              <Ionicons name="call" size={compact ? 14 : 16} color="#fff" />
              {!compact && <Text style={styles.actionText}>Call</Text>}
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                compact && styles.actionButtonCompact,
                styles.whatsappButton,
                edge.raised,
                !user && styles.actionButtonDisabled,
              ]}
              onPress={() =>
                user ? Linking.openURL(toWhatsappLink(agent.whatsappNumber, agent.companyName)) : promptLogin()
              }>
              <Ionicons name="logo-whatsapp" size={compact ? 14 : 16} color="#fff" />
              {!compact && <Text style={styles.actionText}>WhatsApp</Text>}
            </Pressable>
          </View>
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.grabber, { backgroundColor: colors.divider }]} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
              <View style={styles.sheetHeaderRow}>
                {agent.profileImage?.url ? (
                  <Image source={{ uri: agent.profileImage.url }} style={styles.sheetAvatar} />
                ) : (
                  <View style={[styles.sheetAvatar, styles.avatarFallback, { backgroundColor: colors.base }]}>
                    <Ionicons name="business" size={24} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.sheetHeaderText}>
                  <Text style={[styles.sheetName, { color: colors.text }]}>{agent.companyName}</Text>
                  <Text style={[styles.location, { color: colors.textMuted }]}>
                    {agent.city}, {agent.state}
                  </Text>
                  <View style={styles.sheetVerifiedRow}>
                    <VerifiedBadge />
                  </View>
                </View>
                <Pressable onPress={() => setOpen(false)} hitSlop={8} style={[styles.closeButton, { backgroundColor: colors.base }]}>
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </Pressable>
              </View>

              {!!shown.description && (
                <Text style={[styles.sheetDescription, { color: colors.textMuted }]}>{shown.description}</Text>
              )}

              {loadingDetail && (
                <View style={styles.detailLoading}>
                  <ActivityIndicator color={colors.accentText} />
                </View>
              )}
              {!!detailError && <Text style={[styles.errorText, { color: colors.danger }]}>{detailError}</Text>}

              {detail && (
                <View style={[styles.detailsCard, { backgroundColor: colors.base }, edge.pressed]}>
                  {!!detail.ownerName && <DetailRow label="Contact Person" value={detail.ownerName} />}
                  <DetailRow label="Mobile" value={detail.mobileNumber} />
                  <DetailRow label="WhatsApp" value={detail.whatsappNumber} />
                  {!!detail.address && <DetailRow label="Address" value={detail.address} last />}
                </View>
              )}

              <View style={styles.sheetActions}>
                <Pressable
                  style={[styles.sheetActionButton, styles.callButton, edge.raised, !user && styles.actionButtonDisabled]}
                  onPress={() => (user ? Linking.openURL(toTelLink(agent.mobileNumber)) : promptLogin())}>
                  <Ionicons name="call" size={17} color="#fff" />
                  <Text style={styles.sheetActionText}>Call Now</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.sheetActionButton,
                    styles.whatsappButton,
                    edge.raised,
                    !user && styles.actionButtonDisabled,
                  ]}
                  onPress={() =>
                    user ? Linking.openURL(toWhatsappLink(agent.whatsappNumber, agent.companyName)) : promptLogin()
                  }>
                  <Ionicons name="logo-whatsapp" size={17} color="#fff" />
                  <Text style={styles.sheetActionText}>WhatsApp</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
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
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  banner: { height: 150, position: 'relative' },
  bannerCompact: { height: 108 },
  bannerImage: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, fontSize: 16, fontWeight: '800' },
  nameCompact: { fontSize: 13.5 },
  location: { marginTop: 4, fontSize: 13 },
  locationCompact: { marginTop: 2, fontSize: 11 },
  body: { padding: 16 },
  bodyCompact: { padding: 10 },
  description: { marginTop: 10, fontSize: 13, lineHeight: 18 },
  actions: { marginTop: 14, flexDirection: 'row', gap: 8 },
  actionsCompact: { marginTop: 10, gap: 6 },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonCompact: { height: 34, borderRadius: 9 },
  callButton: { backgroundColor: Brand.primary },
  whatsappButton: { backgroundColor: Brand.whatsapp },
  actionButtonDisabled: { opacity: 0.4 },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(18,30,26,0.44)' },
  sheet: {
    height: '58%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  grabber: { width: 46, height: 5, borderRadius: 999, alignSelf: 'center', marginTop: 12, marginBottom: 6 },
  sheetContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  sheetHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  sheetAvatar: { width: 56, height: 56, borderRadius: 18 },
  sheetHeaderText: { flex: 1, minWidth: 0 },
  sheetName: { fontSize: 17, fontWeight: '800' },
  sheetVerifiedRow: { marginTop: 8, flexDirection: 'row' },
  closeButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  sheetDescription: { marginTop: 16, fontSize: 13.5, lineHeight: 20 },
  detailLoading: { marginTop: 20, alignItems: 'center' },
  errorText: { marginTop: 12, fontSize: 12 },
  detailsCard: { marginTop: 18, borderRadius: 16 },
  detailRow: { paddingHorizontal: 16, paddingVertical: 12 },
  detailLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  detailValue: { marginTop: 4, fontSize: 14 },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 22 },
  sheetActionButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sheetActionText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
