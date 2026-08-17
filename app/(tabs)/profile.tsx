import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';
import { ApiError } from '@/lib/api';

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

const MENU_ITEMS = [
  { label: 'My Enquiry', icon: 'chatbox-ellipses-outline' as const, route: '/enquiry' as const },
  { label: 'Find Agents', icon: 'search-outline' as const, route: '/agents' as const },
  { label: 'How UmrahChal Works', icon: 'compass-outline' as const, route: '/how-it-works' as const },
  { label: 'About', icon: 'information-circle-outline' as const, route: '/about' as const },
];

function MenuLinksSection() {
  const { colors, edge } = useTheme();

  return (
    <View style={[styles.settingsCard, { backgroundColor: colors.surface }, edge.raised]}>
      <Text style={[styles.settingsLabel, { color: colors.textMuted }]}>Menu</Text>
      <View style={styles.menuList}>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.route}
            style={({ pressed }) => [styles.menuItem, pressed && edge.pressed]}
            onPress={() => router.push(item.route)}>
            <View style={[styles.menuIconWrap, { backgroundColor: colors.base }, edge.pressed]}>
              <Ionicons name={item.icon} size={17} color={colors.accentText} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function VersionFooter() {
  const { colors } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return <Text style={[styles.versionText, { color: colors.textMuted }]}>UmrahChal · v{version}</Text>;
}

function SettingsSection() {
  const { colors, edge, mode, setMode } = useTheme();

  return (
    <>
      <View style={[styles.settingsCard, { backgroundColor: colors.surface }, edge.raised]}>
        <Text style={[styles.settingsLabel, { color: colors.textMuted }]}>Appearance</Text>
        <View style={[styles.themeTrack, { backgroundColor: colors.base }, edge.pressed]}>
          {THEME_OPTIONS.map((option) => {
            const active = mode === option.mode;
            return (
              <Pressable
                key={option.mode}
                onPress={() => setMode(option.mode)}
                style={[styles.themeOption, active && { backgroundColor: colors.surface }, active && edge.raised]}>
                <Ionicons name={option.icon} size={15} color={active ? colors.accentText : colors.textMuted} />
                <Text style={[styles.themeOptionText, { color: active ? colors.accentText : colors.textMuted }]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface }, edge.raised]}>
        <Text style={[styles.settingsLabel, { color: colors.textMuted }]}>Follow Us</Text>
        <View style={styles.socialRow}>
          {SOCIAL_LINKS.map((social) => (
            <Pressable
              key={social.name}
              onPress={() => {}}
              style={({ pressed }) => [
                styles.socialButton,
                { backgroundColor: colors.base },
                pressed ? edge.pressed : edge.raised,
              ]}>
              <Ionicons name={social.icon} size={20} color={social.color} />
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

export default function AccountScreen() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: colors.base }]} edges={['top']}>
        <ActivityIndicator color={colors.accentText} size="large" />
      </SafeAreaView>
    );
  }

  return user ? <ProfileView /> : <AuthForm />;
}

function ProfileView() {
  const { user, logout } = useAuth();
  const { colors, edge } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.base }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.profileScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeGlowOne} />
          <View style={styles.welcomeGlowTwo} />
          <View style={[styles.welcomeAvatar, edge.raised]}>
            <Text style={styles.welcomeAvatarText}>{user!.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.welcomeName}>Welcome, {user!.name}</Text>
          <Text style={styles.welcomeEmail} numberOfLines={1}>
            {user!.email}
          </Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#fff" />
            <Text style={styles.verifiedBadgeText}>Pilgrim Account</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <MenuLinksSection />
          <SettingsSection />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={({ pressed }) => [styles.logoutRow, pressed && !loggingOut && { opacity: 0.6 }]}>
          {loggingOut ? (
            <ActivityIndicator color={colors.danger} size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              <Text style={[styles.logoutText, { color: colors.danger }]}>Log Out</Text>
            </>
          )}
        </Pressable>

        <VersionFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

function AuthForm() {
  const { login, signup } = useAuth();
  const { colors } = useTheme();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await signup(name.trim(), email.trim(), password, confirmPassword);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.base }]}
      behavior={Platform.select({ ios: 'padding', default: undefined })}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {mode === 'login' ? 'Log in to save and contact Umrah agents.' : 'Sign up to get started with UmrahChal.'}
          </Text>

          <View style={styles.form}>
            {mode === 'signup' && (
              <TextField label="Full Name" value={name} onChangeText={setName} autoCapitalize="words" placeholder="Your name" />
            )}
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 8 characters"
            />
            {mode === 'signup' && (
              <TextField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Re-enter password"
              />
            )}

            {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

            <Button
              label={mode === 'login' ? 'Login' : 'Create Account'}
              onPress={handleSubmit}
              loading={submitting}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textMuted }]}>
              {mode === 'login' ? "New to UmrahChal?" : 'Already have an account?'}
            </Text>
            <Text
              style={[styles.switchLink, { color: colors.accentText }]}
              onPress={() => {
                setError(null);
                setMode(mode === 'login' ? 'signup' : 'login');
              }}>
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </Text>
          </View>

          <View style={styles.settingsSection}>
            <MenuLinksSection />
            <SettingsSection />
          </View>

          <VersionFooter />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  formScroll: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 130 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, fontSize: 14 },
  form: { marginTop: 28, gap: 16 },
  error: { fontSize: 13 },
  submitButton: { marginTop: 4 },
  switchRow: { marginTop: 24, flexDirection: 'row', justifyContent: 'center', gap: 6, flexWrap: 'wrap' },
  switchText: { fontSize: 13 },
  switchLink: { fontSize: 13, fontWeight: '700' },
  welcomeCard: {
    marginHorizontal: 24,
    marginTop: 64,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 26,
    backgroundColor: Brand.primary,
    overflow: 'hidden',
    alignItems: 'center',
  },
  welcomeGlowOne: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  welcomeGlowTwo: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  welcomeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeAvatarText: { color: Brand.primary, fontSize: 24, fontWeight: '800' },
  welcomeName: { marginTop: 14, fontSize: 17, fontWeight: '700', color: '#fff' },
  welcomeEmail: { marginTop: 3, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  verifiedBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  verifiedBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  profileScroll: { paddingBottom: 130 },
  settingsSection: { marginHorizontal: 24, marginTop: 24, gap: 14 },
  settingsCard: { padding: 16, borderRadius: 18 },
  settingsLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  themeTrack: {
    marginTop: 10,
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
  socialRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'center', gap: 14 },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: { marginTop: 10, gap: 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
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
  divider: { height: 1, marginHorizontal: 24, marginTop: 28 },
  logoutRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  logoutText: { fontSize: 14, fontWeight: '700' },
  versionText: { marginTop: 14, fontSize: 11, textAlign: 'center' },
});
