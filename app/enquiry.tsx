import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function EnquiryScreen() {
  const { colors, edge } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.base }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surface }, edge.pressed]}>
        <Ionicons name="chatbox-ellipses-outline" size={32} color={Brand.accent} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>No enquiries yet</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        When you reach out to an Umrah travel agent, your enquiries will show up here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 16, fontSize: 17, fontWeight: '700' },
  body: { marginTop: 8, fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
