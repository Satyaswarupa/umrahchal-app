import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgentCard } from '@/components/AgentCard';
import { SelectField } from '@/components/ui/SelectField';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { getCitiesForState, INDIA_STATES } from '@/constants/locations';
import { api, ApiError } from '@/lib/api';
import { LocationError, resolveNearbyLocation } from '@/lib/location';
import type { AgentSummary } from '@/types';

export default function AgentsScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ state?: string; city?: string }>();
  const [state, setState] = useState(params.state ?? '');
  const [city, setCity] = useState(params.city ?? '');
  const [agents, setAgents] = useState<AgentSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = getCitiesForState(state);

  const load = useCallback(async (currentState: string, currentCity: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set('country', 'India');
      if (currentState) query.set('state', currentState);
      if (currentCity) query.set('city', currentCity);
      const data = await api.get<{ agents: AgentSummary[] }>(`/api/agents?${query.toString()}`);
      setAgents(data.agents);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(params.state ?? '', params.city ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleNearMe() {
    setLocating(true);
    setError(null);
    try {
      const resolved = await resolveNearbyLocation();
      setState(resolved.state);
      setCity(resolved.city);
      await load(resolved.state, resolved.city);
    } catch (err) {
      setError(err instanceof LocationError ? err.message : 'Could not detect your location. Please try again.');
    } finally {
      setLocating(false);
    }
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.base }]} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Search verified travel agents by location.</Text>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterField}>
          <SelectField
            label="State"
            value={state}
            placeholder="All States"
            options={INDIA_STATES}
            onChange={(value) => {
              setState(value);
              setCity('');
            }}
          />
        </View>
        <View style={styles.filterField}>
          <SelectField
            label="City"
            value={city}
            placeholder={state ? 'All Cities' : 'Any'}
            options={cities}
            onChange={setCity}
            disabled={!state}
          />
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Button
          label="Near Me"
          variant="outline"
          icon="locate"
          onPress={handleNearMe}
          loading={locating}
          style={styles.actionButton}
        />
        <Button label="Search" onPress={() => load(state, city)} style={styles.actionButton} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accentText} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
          <Text style={[styles.stateText, { color: colors.textMuted }]}>{error}</Text>
          <Button label="Retry" variant="outline" onPress={() => load(state, city)} style={styles.retryButton} />
        </View>
      ) : agents && agents.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={32} color={colors.textMuted} />
          <Text style={[styles.stateText, { color: colors.textMuted }]}>
            {state
              ? `No verified agents found in ${[city, state].filter(Boolean).join(', ')} yet.`
              : 'No verified agents found for this location yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={agents ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <AgentCard agent={item} />}
          ListHeaderComponent={
            agents ? (
              <Text style={[styles.resultCount, { color: colors.textMuted }]}>
                {agents.length} verified agent{agents.length === 1 ? '' : 's'}
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16 },
  subtitle: { fontSize: 13 },
  filters: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16 },
  filterField: { flex: 1 },
  actionsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 12 },
  actionButton: { flex: 1 },
  list: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  resultCount: { fontSize: 12, marginBottom: 10, fontWeight: '600' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 40 },
  stateText: { textAlign: 'center', fontSize: 13 },
  retryButton: { marginTop: 4 },
});
