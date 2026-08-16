import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/lib/api';

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
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, edge.raised]}>
          <Text style={styles.avatarText}>{user!.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.text }]}>{user!.name}</Text>
        <Text style={[styles.profileEmail, { color: colors.textMuted }]}>{user!.email}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }, edge.raised]}>
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Brand.accent} />
          <Text style={[styles.infoText, { color: colors.textMuted }]}>Signed in as a pilgrim account</Text>
        </View>
      </View>

      <Button label="Log Out" variant="outline" onPress={handleLogout} loading={loggingOut} style={styles.logoutButton} />
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
  profileHeader: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  profileName: { marginTop: 14, fontSize: 19, fontWeight: '700' },
  profileEmail: { marginTop: 2, fontSize: 13 },
  card: {
    marginHorizontal: 24,
    marginTop: 28,
    padding: 16,
    borderRadius: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 13 },
  logoutButton: { marginHorizontal: 24, marginTop: 24 },
});
