import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgentCard } from '@/components/AgentCard';
import { Button } from '@/components/ui/Button';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api, ApiError } from '@/lib/api';
import {
  LocationError,
  resolveLocationQuery,
  resolveNearbyLocation,
  searchLocations,
  type LocationSuggestion,
} from '@/lib/location';
import type { AgentSummary } from '@/types';

const HERO_QUOTE = 'Every journey begins with a sincere heart.';

type NearbyState = {
  loading: boolean;
  agents: AgentSummary[] | null;
  error: string | null;
  state: string;
  city: string;
};

function HeroGlow() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowOneStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.5] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }],
  };
  const glowTwoStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.25] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1.1, 0.95] }) }],
  };

  return (
    <>
      <Animated.View style={[styles.heroGlowOne, glowOneStyle]} />
      <Animated.View style={[styles.heroGlowTwo, glowTwoStyle]} />
    </>
  );
}

export default function HomeScreen() {
  const { colors, edge } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [nearby, setNearby] = useState<NearbyState>({
    loading: true,
    agents: null,
    error: null,
    state: '',
    city: '',
  });

  const loadNearbyAgents = useCallback(async () => {
    setNearby((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const resolved = await resolveNearbyLocation();
      const params = new URLSearchParams();
      params.set('country', 'India');
      if (resolved.state) params.set('state', resolved.state);
      if (resolved.city) params.set('city', resolved.city);
      const data = await api.get<{ agents: AgentSummary[] }>(`/api/agents?${params.toString()}`);
      setNearby({ loading: false, agents: data.agents, error: null, state: resolved.state, city: resolved.city });
    } catch (err) {
      const message =
        err instanceof LocationError || err instanceof ApiError
          ? err.message
          : 'Could not load agents near you.';
      setNearby({ loading: false, agents: null, error: message, state: '', city: '' });
    }
  }, []);

  useEffect(() => {
    loadNearbyAgents();
  }, [loadNearbyAgents]);

  function handleChangeQuery(text: string) {
    setQuery(text);
    setSearchError(null);
    setSuggestions(text.trim() ? searchLocations(text) : []);
  }

  function goToAgents(state: string, city: string) {
    setSuggestions([]);
    router.push({ pathname: '/agents', params: { state, city } });
  }

  function handleSelectSuggestion(suggestion: LocationSuggestion) {
    goToAgents(suggestion.state, suggestion.city);
  }

  function handleSearchSubmit() {
    if (!query.trim()) {
      goToAgents('', '');
      return;
    }
    const resolved = resolveLocationQuery(query);
    if (!resolved) {
      setSearchError('No matching city or state found. Try another search.');
      return;
    }
    goToAgents(resolved.state, resolved.city);
  }

  const nearbyLocationLabel = [nearby.city, nearby.state].filter(Boolean).join(', ');

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.base }]} contentContainerStyle={styles.content} bounces={false}>
      <View style={styles.hero}>
        <HeroGlow />
        <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
          <Text style={styles.brandName}>UmrahChal</Text>
          <Text style={styles.greeting}>
            Assalamu Alaikum{user ? ',' : ''}
            {user ? `\n${user.name}` : ''}
          </Text>
          <Text style={styles.quote}>{HERO_QUOTE}</Text>
        </SafeAreaView>
      </View>

      <View style={[styles.searchCard, { backgroundColor: colors.surface }, edge.raised]}>
        <View style={styles.searchMascotWrap}>
          <Image
            source={require('../../assets/images/mascot.png')}
            style={styles.searchMascotImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.searchLabel, { color: colors.accentText }]}>Search Location</Text>
        <View style={[styles.searchInputRow, { backgroundColor: colors.surface }, edge.pressed]}>
          <Ionicons name="search" size={18} color={colors.placeholder} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search city, e.g. Delhi"
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={handleChangeQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCapitalize="words"
          />
          <View style={[styles.inputDivider, { backgroundColor: colors.divider }]} />
          <Pressable
            onPress={loadNearbyAgents}
            hitSlop={8}
            style={({ pressed }) => [
              styles.nearMeIconButton,
              { backgroundColor: colors.base },
              pressed ? edge.pressed : edge.raised,
            ]}>
            {nearby.loading ? (
              <ActivityIndicator size="small" color={colors.accentText} />
            ) : (
              <Ionicons name="locate" size={17} color={colors.accentText} />
            )}
          </Pressable>
        </View>

        {suggestions.length > 0 && (
          <View style={[styles.suggestions, { backgroundColor: colors.surface }, edge.raised]}>
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion.label}
                onPress={() => handleSelectSuggestion(suggestion)}
                style={[
                  styles.suggestionRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.divider },
                ]}>
                <Ionicons name="location-outline" size={16} color={colors.accentText} />
                <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {searchError && <Text style={[styles.errorText, { color: colors.danger }]}>{searchError}</Text>}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Agents Near You</Text>
          {!!nearbyLocationLabel && (
            <Text style={[styles.sectionLocation, { color: colors.textMuted }]}>{nearbyLocationLabel}</Text>
          )}
        </View>

        {nearby.loading ? (
          <View style={styles.nearbyCentered}>
            <ActivityIndicator color={colors.accentText} />
          </View>
        ) : nearby.error ? (
          <View style={[styles.nearbyPrompt, { backgroundColor: colors.surface }, edge.raised]}>
            <Ionicons name="location-outline" size={22} color={colors.textMuted} />
            <Text style={[styles.nearbyPromptText, { color: colors.textMuted }]}>{nearby.error}</Text>
            <Button label="Try Again" variant="outline" onPress={loadNearbyAgents} style={styles.nearbyPromptButton} />
          </View>
        ) : nearby.agents && nearby.agents.length > 0 ? (
          <View style={styles.nearbyList}>
            {nearby.agents.slice(0, 3).map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            <Pressable onPress={() => goToAgents(nearby.state, nearby.city)} style={styles.viewAllLink}>
              <Text style={[styles.viewAllText, { color: colors.accentText }]}>
                View all agents in {nearbyLocationLabel}
              </Text>
              <Ionicons name="arrow-forward" size={14} color={colors.accentText} />
            </Pressable>
          </View>
        ) : (
          <View style={[styles.nearbyPrompt, { backgroundColor: colors.surface }, edge.raised]}>
            <Ionicons name="search-outline" size={22} color={colors.textMuted} />
            <Text style={[styles.nearbyPromptText, { color: colors.textMuted }]}>
              No verified agents found in {nearbyLocationLabel || 'your area'} yet.
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.promoCard, edge.raised]}>
        <Text style={styles.promoTitle}>Are you an Umrah travel agent?</Text>
        <Text style={styles.promoBody}>
          Register your company on UmrahChal to reach pilgrims searching for trusted agents in
          your city.
        </Text>
        <Button
          label="List your Business for FREE"
          variant="outline"
          style={styles.promoButton}
          onPress={() => Linking.openURL('https://umrahnoor.vercel.app/admin/signup')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 130 },
  hero: {
    justifyContent: 'flex-start',
    backgroundColor: Brand.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    paddingBottom: 30,
  },
  heroGlowOne: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Brand.light,
  },
  heroGlowTwo: {
    position: 'absolute',
    bottom: -50,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Brand.accent,
  },
  heroSafeArea: { paddingHorizontal: 20, paddingTop: 18 },
  brandName: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  greeting: { marginTop: 20, color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  quote: { marginTop: 6, color: '#E4EAE8', fontSize: 14, fontStyle: 'italic', lineHeight: 19 },
  searchCard: {
    marginHorizontal: 20,
    marginTop: -22,
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  searchMascotWrap: {
    position: 'absolute',
    top: -74,
    right: -26,
    width: 136,
    height: 136,
    zIndex: 1,
  },
  searchMascotImage: {
    width: '100%',
    height: '100%',
  },
  searchLabel: { fontSize: 13, fontWeight: '600' },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingLeft: 14,
  },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  inputDivider: { width: 1, height: 22 },
  nearMeIconButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestions: { borderRadius: 16, overflow: 'hidden' },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  suggestionText: { fontSize: 14, flex: 1 },
  errorText: { fontSize: 12 },
  section: { paddingHorizontal: 20, marginTop: 36 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  sectionLocation: { fontSize: 12, fontWeight: '600' },
  nearbyCentered: { marginTop: 20, alignItems: 'center' },
  nearbyList: { marginTop: 16, gap: 12 },
  nearbyPrompt: {
    marginTop: 16,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  nearbyPromptText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  nearbyPromptButton: { marginTop: 4, alignSelf: 'stretch' },
  viewAllLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8 },
  viewAllText: { fontSize: 13, fontWeight: '600' },
  promoCard: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Brand.darkest,
  },
  promoTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  promoBody: { color: '#C7D3D0', fontSize: 13, marginTop: 6, lineHeight: 19 },
  promoButton: { marginTop: 16, backgroundColor: '#fff' },
});
