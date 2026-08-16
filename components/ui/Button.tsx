import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type Variant = 'primary' | 'outline' | 'whatsapp' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, icon, style }: Props) {
  const { colors, edge } = useTheme();
  const isDisabled = disabled || loading;
  const isTinted = variant === 'outline' || variant === 'ghost';

  const fillStyle =
    variant === 'primary'
      ? { backgroundColor: Brand.primary }
      : variant === 'whatsapp'
        ? { backgroundColor: Brand.whatsapp }
        : variant === 'outline'
          ? { backgroundColor: colors.surface }
          : { backgroundColor: 'transparent' };

  const textColor = isTinted ? colors.accentText : '#fff';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fillStyle,
        pressed && !isDisabled ? edge.pressed : edge.raised,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={16} color={textColor} />}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
