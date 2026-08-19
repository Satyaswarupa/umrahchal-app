import type { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

export type ServiceOption = { slug: string; label: string; icon: string; iconName: IoniconName };

export const SERVICES: ServiceOption[] = [
  { slug: 'air-ticket', label: 'Air Ticket', icon: '✈️', iconName: 'airplane-outline' },
  { slug: 'group-fare-umrah', label: 'Group Fare Umrah', icon: '👥', iconName: 'people-outline' },
  { slug: 'hotels', label: 'Hotels', icon: '🏨', iconName: 'business-outline' },
  { slug: 'transport', label: 'Transport', icon: '🚌', iconName: 'bus-outline' },
  { slug: 'food', label: 'Food', icon: '🍽️', iconName: 'restaurant-outline' },
  { slug: 'laundry', label: 'Laundry', icon: '👔', iconName: 'shirt-outline' },
  { slug: 'umrah-guide', label: 'Umrah Guide', icon: '🧭', iconName: 'compass-outline' },
  { slug: 'umrah-kit', label: 'Umrah Kit', icon: '🎒', iconName: 'cube-outline' },
  { slug: 'zam-zam-water', label: 'Zam Zam Water', icon: '💧', iconName: 'water-outline' },
  { slug: 'visa', label: 'Visa', icon: '📄', iconName: 'document-text-outline' },
];
