import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { SideMenu } from '@/components/SideMenu';
import { useTheme } from '@/context/ThemeContext';
import type { EdgeStyles, ThemeColors } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  activeName,
  focused,
  colors,
  edge,
}: {
  name: IconName;
  activeName: IconName;
  focused: boolean;
  colors: ThemeColors;
  edge: EdgeStyles;
}) {
  return (
    <View style={[styles.tabIconWrap, focused && { backgroundColor: colors.surface }, focused && edge.raised]}>
      <Ionicons name={focused ? activeName : name} size={20} color={focused ? colors.accentText : colors.tabInactive} />
    </View>
  );
}

export default function TabLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors, edge } = useTheme();

  return (
    <View style={styles.flex}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: colors.accentText,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
          tabBarStyle: [
            styles.tabBar,
            { left: 20, right: 20, bottom: insets.bottom + 4, backgroundColor: colors.surface },
            edge.raised,
          ],
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home-outline" activeName="home" focused={focused} colors={colors} edge={edge} />
            ),
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="construct-outline" activeName="construct" focused={focused} colors={colors} edge={edge} />
            ),
          }}
        />
        <Tabs.Screen
          name="packages"
          options={{
            title: 'Packages',
            tabBarIcon: ({ focused }) => (
              <TabIcon name="briefcase-outline" activeName="briefcase" focused={focused} colors={colors} edge={edge} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="person-circle-outline"
                activeName="person-circle"
                focused={focused}
                colors={colors}
                edge={edge}
              />
            ),
          }}
        />
      </Tabs>

      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.menuButtonSafeArea}>
        <Pressable
          onPress={() => setMenuOpen(true)}
          hitSlop={10}
          style={({ pressed }) => [
            styles.menuButton,
            { backgroundColor: colors.surface },
            pressed ? edge.pressed : edge.raised,
          ]}>
          <Ionicons name="menu" size={20} color={colors.accentText} />
        </Pressable>
      </SafeAreaView>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  menuButtonSafeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
  menuButton: {
    marginTop: 10,
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    position: 'absolute',
    height: 64,
    borderRadius: 28,
    borderTopWidth: 0,
    paddingTop: 0,
    paddingHorizontal: 26,
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
