import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

function useLoopingPulse(duration: number) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration]);

  return value;
}

export function LoadingScreen() {
  const glowPulse = useLoopingPulse(3200);
  const logoPulse = useLoopingPulse(1600);

  const glowOneStyle = {
    opacity: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.42] }),
    transform: [{ scale: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }) }],
  };
  const glowTwoStyle = {
    opacity: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.42, 0.22] }),
    transform: [{ scale: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [1.12, 0.94] }) }],
  };
  const logoStyle = {
    transform: [{ scale: logoPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.glowOne, glowOneStyle]} />
      <Animated.View style={[styles.glowTwo, glowTwoStyle]} />
      <Animated.View style={[styles.glowThree, glowOneStyle]} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image source={require('../assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
        </Animated.View>
        <Text style={styles.brandName}>UmrahJao</Text>
        <Text style={styles.quote}>Every journey begins with a sincere heart.</Text>

        <View style={styles.loaderRow}>
          <ActivityIndicator color="#fff" size="small" />
          <Text style={styles.loaderText}>Preparing your journey…</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowOne: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Brand.light,
  },
  glowTwo: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Brand.accent,
  },
  glowThree: {
    position: 'absolute',
    bottom: 60,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Brand.light,
  },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 64, height: 64 },
  brandName: { marginTop: 18, fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  quote: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  loaderRow: { marginTop: 36, flexDirection: 'row', alignItems: 'center', gap: 10 },
  loaderText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
});
