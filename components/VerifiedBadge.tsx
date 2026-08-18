import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';

export function VerifiedBadge({ compact }: { compact?: boolean }) {
  const { colors, edge } = useTheme();

  if (compact) {
    return (
      <View style={[styles.iconBadge, { backgroundColor: colors.surface }, edge.raised]}>
        <Ionicons name="checkmark-circle" size={14} color={colors.accentText} />
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: colors.surface }, edge.raised]}>
      <Ionicons name="checkmark-circle" size={13} color={colors.accentText} />
      <Text style={[styles.text, { color: colors.accentText }]}>Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: { fontSize: 11, fontWeight: '700' },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
