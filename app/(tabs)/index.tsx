import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgentCard } from '@/components/AgentCard';
import { Button } from '@/components/ui/Button';
import { Brand } from '@/constants/theme';
import { SERVICES } from '@/constants/services';
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
  started: boolean;
  agents: AgentSummary[] | null;
  error: string | null;
  state: string;
  city: string;
  source: 'geo' | 'search';
};

function LocateRing({ active }: { active: boolean }) {
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    ring.setValue(0);
    const loop = Animated.loop(
      Animated.timing(ring, { toValue: 1, duration: 2200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [active, ring]);

  if (!active) return null;

  return (
    <Animated.View
      style={[
        styles.locateRing,
        {
          opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
          transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.2] }) }],
        },
      ]}
    />
  );
}

export default function HomeScreen() {
  const { colors, edge } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [nearby, setNearby] = useState<NearbyState>({
    loading: false,
    started: false,
    agents: null,
    error: null,
    state: '',
    city: '',
    source: 'geo',
  });

  const loadNearbyAgents = useCallback(async () => {
    setNearby((prev) => ({ ...prev, loading: true, started: true, error: null, source: 'geo' }));
    try {
      const resolved = await resolveNearbyLocation();
      const params = new URLSearchParams();
      params.set('country', 'India');
      if (resolved.state) params.set('state', resolved.state);
      if (resolved.city) params.set('city', resolved.city);
      const data = await api.get<{ agents: AgentSummary[] }>(`/api/agents?${params.toString()}`);
      setNearby({
        loading: false,
        started: true,
        agents: data.agents,
        error: null,
        state: resolved.state,
        city: resolved.city,
        source: 'geo',
      });
    } catch (err) {
      const message =
        err instanceof LocationError || err instanceof ApiError
          ? err.message
          : 'Could not load agents near you.';
      setNearby({ loading: false, started: true, agents: null, error: message, state: '', city: '', source: 'geo' });
    }
  }, []);

  const searchAgents = useCallback(async (state: string, city: string) => {
    setSuggestions([]);
    setNearby((prev) => ({ ...prev, loading: true, started: true, error: null, source: 'search' }));
    try {
      const params = new URLSearchParams();
      params.set('country', 'India');
      if (state) params.set('state', state);
      if (city) params.set('city', city);
      const data = await api.get<{ agents: AgentSummary[] }>(`/api/agents?${params.toString()}`);
      setNearby({ loading: false, started: true, agents: data.agents, error: null, state, city, source: 'search' });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not load agents for that search.';
      setNearby({ loading: false, started: true, agents: null, error: message, state, city, source: 'search' });
    }
  }, []);

  function handleChangeQuery(text: string) {
    setQuery(text);
    setSearchError(null);
    setSuggestions(text.trim() ? searchLocations(text) : []);
  }

  function handleClearQuery() {
    setQuery('');
    setSuggestions([]);
    setSearchError(null);
    loadNearbyAgents();
  }

  function goToAgents(state: string, city: string, service?: string) {
    setSuggestions([]);
    router.push({ pathname: '/agents', params: service ? { service } : { state, city } });
  }

  function handleSelectSuggestion(suggestion: LocationSuggestion) {
    setQuery(suggestion.label);
    searchAgents(suggestion.state, suggestion.city);
  }

  function handleSearchSubmit() {
    if (!query.trim()) {
      loadNearbyAgents();
      return;
    }
    const resolved = resolveLocationQuery(query);
    if (!resolved) {
      setSearchError('No matching city or state found. Try another search.');
      return;
    }
    searchAgents(resolved.state, resolved.city);
  }

  const nearbyLocationLabel = [nearby.city, nearby.state].filter(Boolean).join(', ');

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.base }]} contentContainerStyle={styles.content} bounces={false}>
      <LinearGradient colors={[Brand.primary, Brand.darkest]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
          <View style={styles.heroBrandRow} />
          <View style={styles.heroGreetingCol}>
            <Text style={[styles.greetingSmall, styles.rtlText]}>{user ? 'السلام علیکم،' : 'السلام علیکم'}</Text>
            <Text style={styles.greeting}>{user ? user.name : 'Welcome'}</Text>
          </View>
          <Text style={styles.quote}>{HERO_QUOTE}</Text>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.searchCard}>
        <View style={[styles.searchInputRow, { backgroundColor: colors.base }, edge.raised]}>
          <Ionicons name="search" size={17} color={colors.placeholder} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search agent or area…"
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={handleChangeQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCapitalize="words"
          />
          {query.length > 0 && (
            <Pressable onPress={handleClearQuery} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.placeholder} />
            </Pressable>
          )}
          <View style={[styles.searchDivider, { backgroundColor: colors.divider }]} />
          <Pressable onPress={loadNearbyAgents} style={styles.nearMeInline} hitSlop={8}>
            <LocateRing active={nearby.loading} />
            {nearby.loading ? (
              <ActivityIndicator size="small" color={colors.accentText} />
            ) : (
              <Ionicons name="navigate" size={17} color={colors.accentText} />
            )}
          </Pressable>
        </View>

        {suggestions.length > 0 && (
          <View style={[styles.suggestions, { backgroundColor: colors.base }, edge.raised]}>
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.shortcutsRow}>
        {SERVICES.map((s) => (
          <Pressable key={s.slug} onPress={() => goToAgents('', '', s.slug)} style={styles.shortcutItem}>
            <View style={styles.shortcutRing}>
              <Ionicons name={s.iconName} size={22} color="#fff" />
            </View>
            <Text style={[styles.shortcutLabel, { color: colors.text }]} numberOfLines={2}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {nearby.source === 'search' ? 'Search Results' : 'Agents Near You'}
          </Text>
          {!!nearbyLocationLabel && (
            <Text style={[styles.sectionLocation, { color: colors.accentText }]}>{nearbyLocationLabel}</Text>
          )}
        </View>

        {!nearby.started ? (
          <View style={[styles.nearbyPrompt, { backgroundColor: colors.surface }, edge.raised]}>
            <Ionicons name="navigate-outline" size={22} color={colors.textMuted} />
            <Text style={[styles.nearbyPromptText, { color: colors.textMuted }]}>
              Allow location access to see verified agents near you, or search for a city above.
            </Text>
            <Button label="Use My Location" variant="outline" onPress={loadNearbyAgents} style={styles.nearbyPromptButton} />
          </View>
        ) : nearby.loading ? (
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
            <View style={styles.agentGrid}>
              {nearby.agents.slice(0, 4).map((agent) => (
                <View key={agent.id} style={styles.agentGridItem}>
                  <AgentCard agent={agent} compact />
                </View>
              ))}
            </View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 130 },
  hero: {
    justifyContent: 'flex-start',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    paddingBottom: 34,
  },
  heroSafeArea: { paddingHorizontal: 20, paddingTop: 8 },
  heroBrandRow: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  heroGreetingCol: { marginTop: 14, alignItems: 'flex-end' },
  greetingSmall: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700' },
  greeting: { marginTop: 2, color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 27, textAlign: 'right' },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  quote: { marginTop: 16, color: 'rgba(255,255,255,0.75)', fontSize: 13, fontStyle: 'italic', lineHeight: 19, textAlign: 'right' },
  searchCard: {
    marginHorizontal: 20,
    marginTop: -22,
    gap: 12,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 14.5, height: '100%', fontWeight: '600' },
  searchDivider: { width: 1, height: 22 },
  nearMeInline: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Brand.light,
  },
  suggestions: { borderRadius: 16, overflow: 'hidden' },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  suggestionText: { fontSize: 14, flex: 1 },
  errorText: { fontSize: 12 },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 26,
  },
  shortcutItem: { alignItems: 'center', gap: 7, width: 66 },
  shortcutRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
  },
  shortcutLabel: { fontSize: 10, fontWeight: '800', textAlign: 'center', lineHeight: 12.5 },
  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  sectionLocation: { fontSize: 12, fontWeight: '700' },
  nearbyCentered: { marginTop: 20, alignItems: 'center' },
  nearbyList: { marginTop: 16 },
  agentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  agentGridItem: { width: '48%' },
  nearbyPrompt: {
    marginTop: 16,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  nearbyPromptText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  nearbyPromptButton: { marginTop: 4, alignSelf: 'stretch' },
  viewAllLink: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  viewAllText: { fontSize: 13, fontWeight: '600' },
});
