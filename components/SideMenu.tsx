import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

const PANEL_WIDTH = Math.min(300, Dimensions.get('window').width * 0.82);

const MENU_ITEMS = [
  { label: 'My Enquiry', icon: 'chatbox-ellipses-outline' as const, route: '/enquiry' as const },
  { label: 'Find Agents', icon: 'search-outline' as const, route: '/agents' as const },
  { label: 'About', icon: 'information-circle-outline' as const, route: '/about' as const },
];

const THEME_OPTIONS: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { mode: 'light', icon: 'sunny-outline', label: 'Light' },
  { mode: 'system', icon: 'phone-portrait-outline', label: 'Auto' },
  { mode: 'dark', icon: 'moon-outline', label: 'Dark' },
];

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'logo-facebook' as const, color: '#1877F2' },
  { name: 'Instagram', icon: 'logo-instagram' as const, color: '#E1306C' },
  { name: 'YouTube', icon: 'logo-youtube' as const, color: '#FF0000' },
];

export function SideMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { colors, edge, mode, setMode } = useTheme();
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -PANEL_WIDTH,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateX, backdropOpacity]);

  function go(route: (typeof MENU_ITEMS)[number]['route']) {
    onClose();
    router.push(route);
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[styles.panel, { width: PANEL_WIDTH, backgroundColor: colors.base, transform: [{ translateX }] }]}>
          <SafeAreaView style={styles.panelSafeArea} edges={['top', 'bottom']}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              <View style={styles.headerCard}>
                <View style={styles.headerGlowOne} />
                <View style={styles.headerGlowTwo} />
                <View style={[styles.avatar, edge.raised]}>
                  <Text style={styles.avatarText}>{(user?.name ?? 'U').charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.welcome}>{user ? `Welcome, ${user.name}` : 'Welcome to UmrahChal'}</Text>
                {user ? (
                  <Text style={styles.email} numberOfLines={1}>
                    {user.email}
                  </Text>
                ) : (
                  <Pressable
                    style={({ pressed }) => [styles.loginPill, pressed && styles.loginPillPressed]}
                    onPress={() => {
                      onClose();
                      router.push('/profile');
                    }}>
                    <Text style={styles.loginLink}>Log in / Sign up</Text>
                    <Ionicons name="arrow-forward" size={13} color={Brand.primary} />
                  </Pressable>
                )}
              </View>

              <View style={styles.menu}>
                {MENU_ITEMS.map((item) => (
                  <Pressable
                    key={item.route}
                    style={({ pressed }) => [styles.menuItem, pressed && edge.pressed]}
                    onPress={() => go(item.route)}>
                    <View style={[styles.menuIconWrap, { backgroundColor: colors.surface }, edge.pressed]}>
                      <Ionicons name={item.icon} size={17} color={colors.accentText} />
                    </View>
                    <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Text style={[styles.socialLabel, { color: colors.textMuted }]}>Follow Us</Text>
              <View style={styles.socialRow}>
                {SOCIAL_LINKS.map((social) => (
                  <Pressable
                    key={social.name}
                    onPress={() => {}}
                    style={({ pressed }) => [
                      styles.socialButton,
                      { backgroundColor: colors.surface },
                      pressed ? edge.pressed : edge.raised,
                    ]}>
                    <Ionicons name={social.icon} size={20} color={social.color} />
                  </Pressable>
                ))}
              </View>

              <View style={styles.themeSection}>
                <Text style={[styles.themeLabel, { color: colors.textMuted }]}>Appearance</Text>
                <View style={[styles.themeTrack, { backgroundColor: colors.base }, edge.pressed]}>
                  {THEME_OPTIONS.map((option) => {
                    const active = mode === option.mode;
                    return (
                      <Pressable
                        key={option.mode}
                        onPress={() => setMode(option.mode)}
                        style={[
                          styles.themeOption,
                          active && { backgroundColor: colors.surface },
                          active && edge.raised,
                        ]}>
                        <Ionicons
                          name={option.icon}
                          size={15}
                          color={active ? colors.accentText : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.themeOptionText,
                            { color: active ? colors.accentText : colors.textMuted },
                          ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                style={[styles.closeButton, { borderTopColor: colors.divider }]}
                onPress={onClose}
                hitSlop={10}>
                <Ionicons name="close" size={20} color={Brand.accent} />
                <Text style={[styles.closeText, { color: colors.textMuted }]}>Close</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,13,18,0.5)' },
  panel: {
    height: '100%',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#040D12',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 4, height: 0 },
    elevation: 8,
  },
  panelSafeArea: { flex: 1 },
  scroll: { flex: 1 },
  headerCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Brand.primary,
    overflow: 'hidden',
  },
  headerGlowOne: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerGlowTwo: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Brand.primary, fontSize: 20, fontWeight: '800' },
  welcome: { marginTop: 14, fontSize: 16, fontWeight: '700', color: '#fff' },
  email: { marginTop: 3, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  loginPill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  loginPillPressed: { opacity: 0.85 },
  loginLink: { fontSize: 12, fontWeight: '700', color: Brand.primary },
  themeSection: { paddingHorizontal: 20, paddingTop: 18 },
  themeLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  themeTrack: {
    marginTop: 8,
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
  },
  themeOptionText: { fontSize: 11, fontWeight: '700' },
  menu: { paddingHorizontal: 12, paddingTop: 14 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 14,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  footer: { paddingTop: 8 },
  socialLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  socialRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  closeText: { fontSize: 13, fontWeight: '600' },
});
