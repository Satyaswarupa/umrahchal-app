import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { EdgeStyles } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const NAV_ACTIVE_TINT = '#fff';
const NAV_INACTIVE_TINT = 'rgba(255,255,255,0.55)';
const NAV_ACTIVE_PILL = 'rgba(255,255,255,0.18)';

function TabIcon({
  name,
  activeName,
  focused,
  edge,
}: {
  name: IconName;
  activeName: IconName;
  focused: boolean;
  edge: EdgeStyles;
}) {
  return (
    <View style={[styles.tabIconWrap, focused && { backgroundColor: NAV_ACTIVE_PILL }, focused && edge.raised]}>
      <Ionicons name={focused ? activeName : name} size={20} color={focused ? NAV_ACTIVE_TINT : NAV_INACTIVE_TINT} />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { edge } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const sideMargin = screenWidth * 0.05;

  return (
    <View style={styles.flex}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: NAV_ACTIVE_TINT,
          tabBarInactiveTintColor: NAV_INACTIVE_TINT,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
          tabBarStyle: {
            position: 'absolute',
            height: 64,
            borderRadius: 28,
            borderTopWidth: 0,
            paddingTop: 0,
            paddingHorizontal: 10,
            left: sideMargin,
            right: sideMargin,
            insetInlineStart: sideMargin,
            insetInlineEnd: sideMargin,
            bottom: insets.bottom + 4,
            backgroundColor: Brand.primary,
            ...edge.raised,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon name="home-outline" activeName="home" focused={focused} edge={edge} />,
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="construct-outline" activeName="construct" focused={focused} edge={edge} />
            ),
          }}
        />
        <Tabs.Screen
          name="packages"
          options={{
            title: 'Packages',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="briefcase-outline" activeName="briefcase" focused={focused} edge={edge} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person-circle-outline" activeName="person-circle" focused={focused} edge={edge} />
            ),
          }}
        />
      </Tabs>

      <SafeAreaView edges={['top']} pointerEvents="none" style={styles.menuButtonSafeArea}>
        <View style={styles.menuButton}>
          <Image source={require('../../assets/images/icon.png')} style={styles.menuLogo} resizeMode="contain" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  menuButtonSafeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
  menuButton: {
    marginTop: 8,
    marginLeft: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLogo: { width: 34, height: 34 },
  tabBarItem: { paddingTop: 8 },
  tabBarLabel: { fontSize: 10.5, fontWeight: '700', marginTop: 2 },
  tabIconWrap: {
    width: 36,
    height: 30,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
