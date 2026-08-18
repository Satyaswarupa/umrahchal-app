import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Tabs, usePathname } from 'expo-router';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { EdgeStyles } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const NAV_ACTIVE_TINT = Brand.light;
const NAV_INACTIVE_TINT = 'rgba(255,255,255,0.55)';
const NAV_ACTIVE_PILL = 'rgba(255,255,255,0.14)';

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
  const { colors, edge } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const sideMargin = screenWidth * 0.05;
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '/index';

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
          tabBarBackground: () => (
            <LinearGradient
              colors={[Brand.primary, Brand.darkest]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ),
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
            overflow: 'hidden',
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

      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.menuButtonSafeArea}>
        {isHome ? (
          <View style={styles.menuButton} pointerEvents="none">
            <Image source={require('../../assets/images/icon.png')} style={styles.menuLogo} resizeMode="contain" />
          </View>
        ) : (
          <Pressable
            onPress={() => router.push('/')}
            hitSlop={8}
            style={[styles.backButton, { backgroundColor: colors.surface }, edge.raised]}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  menuButtonSafeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 16,
    height: 54,
    paddingHorizontal: 8,
  },
  menuLogo: { width: 40, height: 40, borderRadius: 20 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 15,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
