import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Tabs, usePathname } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

const NAV_ACTIVE_TINT = '#ffffff';
const NAV_INACTIVE_TINT = 'rgba(255,255,255,0.55)';

function TabIcon({
  name,
  activeName,
  focused,
}: {
  name: IconName;
  activeName: IconName;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons name={focused ? activeName : name} size={20} color={focused ? NAV_ACTIVE_TINT : NAV_INACTIVE_TINT} />
      {focused && <View style={styles.activeUnderline} />}
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
            tabBarIcon: ({ focused }) => <TabIcon name="home-outline" activeName="home" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="construct-outline" activeName="construct" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="packages"
          options={{
            title: 'Packages',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="briefcase-outline" activeName="briefcase" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person-circle-outline" activeName="person-circle" focused={focused} />
            ),
          }}
        />
      </Tabs>

      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.menuButtonSafeArea}>
        {isHome ? (
          <View style={styles.homeTopRow}>
            <Image source={require('../../assets/images/icon.png')} style={styles.menuLogo} resizeMode="contain" />
            <Text style={styles.appName}>
              Umrah<Text style={styles.appNameAccent}>Jao</Text>
            </Text>
            <Pressable style={styles.notificationButton} hitSlop={8}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </Pressable>
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
  homeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    height: 54,
    paddingHorizontal: 16,
  },
  menuLogo: { width: 40, height: 40, borderRadius: 20 },
  appName: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appNameAccent: { color: '#E8B20F' },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeUnderline: {
    width: 16,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: NAV_ACTIVE_TINT,
  },
});
