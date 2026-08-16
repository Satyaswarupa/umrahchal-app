import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';

export function VerifiedBadge() {
  const { colors, edge } = useTheme();

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
});
