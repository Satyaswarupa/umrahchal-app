import * as Location from 'expo-location';

import { getCitiesForState, INDIA_STATES } from '@/constants/locations';

export type ResolvedLocation = {
  state: string;
  city: string;
  rawRegion?: string;
  rawCity?: string;
};

export type LocationErrorCode = 'permission-denied' | 'unavailable' | 'no-match';

export class LocationError extends Error {
  code: LocationErrorCode;
  constructor(message: string, code: LocationErrorCode) {
    super(message);
    this.code = code;
  }
}

// Handles a few common alternate names a geocoder may return for a state.
const STATE_ALIASES: Record<string, string> = {
  orissa: 'Odisha',
  'nct of delhi': 'Delhi',
  'delhi ncr': 'Delhi',
  pondicherry: 'Puducherry',
  uttaranchal: 'Uttarakhand',
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchState(rawRegion: string | null | undefined): string {
  if (!rawRegion) return '';
  const normalized = normalize(rawRegion);
  if (STATE_ALIASES[normalized]) return STATE_ALIASES[normalized];
  return INDIA_STATES.find((state) => normalize(state) === normalized) ?? '';
}

function matchCity(state: string, rawCity: string | null | undefined): string {
  if (!state || !rawCity) return '';
  const normalized = normalize(rawCity);
  return getCitiesForState(state).find((city) => normalize(city) === normalized) ?? '';
}

// Agents are registered against an administrative state/city, not GPS
// coordinates, so "near me" means: locate the device, reverse-geocode that
// to a state/city, then reuse the normal state/city search.
export async function resolveNearbyLocation(): Promise<ResolvedLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationError(
      'Location permission was denied. Enable it in your device settings to find agents near you.',
      'permission-denied',
    );
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

  const results = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });
  const place = results[0];
  if (!place) {
    throw new LocationError('Could not determine your location. Please try again.', 'unavailable');
  }

  const rawRegion = place.region ?? undefined;
  const rawCity = place.city ?? place.subregion ?? place.district ?? undefined;

  const state = matchState(rawRegion);
  if (!state) {
    throw new LocationError(
      `We couldn't match your location${rawRegion ? ` (${rawRegion})` : ''} to a supported state.`,
      'no-match',
    );
  }

  const city = matchCity(state, rawCity);
  return { state, city, rawRegion, rawCity };
}

export type LocationSuggestion = { state: string; city: string; label: string };

// Free-text search over the known state/city list, e.g. typing "jaipur" or
// "odisha" — used for the search bar's autocomplete.
export function searchLocations(query: string, limit = 6): LocationSuggestion[] {
  const trimmed = normalize(query);
  if (!trimmed) return [];

  const results: LocationSuggestion[] = [];

  for (const state of INDIA_STATES) {
    if (normalize(state).includes(trimmed)) {
      results.push({ state, city: '', label: state });
    }
    for (const city of getCitiesForState(state)) {
      if (normalize(city).includes(trimmed)) {
        results.push({ state, city, label: `${city}, ${state}` });
      }
    }
  }

  results.sort((a, b) => {
    const aStarts = normalize(a.label).startsWith(trimmed) ? 0 : 1;
    const bStarts = normalize(b.label).startsWith(trimmed) ? 0 : 1;
    return aStarts - bStarts;
  });

  return results.slice(0, limit);
}

// Best-effort single match for when the user submits the search bar directly
// instead of picking a suggestion.
export function resolveLocationQuery(query: string): { state: string; city: string } | null {
  const [best] = searchLocations(query, 1);
  return best ? { state: best.state, city: best.city } : null;
}
