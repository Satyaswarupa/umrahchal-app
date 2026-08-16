import { DefaultTheme, DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Brand } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function detailScreenOptions(title: string, background: string, text: string) {
  return {
    title,
    headerStyle: { backgroundColor: background },
    headerTintColor: text,
    headerShadowVisible: false,
  };
}

function RootNavigator() {
  const { scheme, colors } = useTheme();

  const navTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: Brand.primary,
      background: colors.base,
      card: colors.base,
      text: colors.text,
      border: colors.divider,
    },
  };

  return (
    <NavigationThemeProvider value={navTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="agents/index"
          options={detailScreenOptions('Find Agents', colors.base, colors.text)}
        />
        <Stack.Screen
          name="agents/[id]"
          options={detailScreenOptions('Agent Details', colors.base, colors.text)}
        />
        <Stack.Screen name="enquiry" options={detailScreenOptions('My Enquiry', colors.base, colors.text)} />
        <Stack.Screen name="about" options={detailScreenOptions('About', colors.base, colors.text)} />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
