import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...rest }: Props) {
  const { colors, edge } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.accentText }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          { backgroundColor: colors.surface, color: colors.text },
          edge.pressed,
          error
            ? {
                borderTopColor: colors.danger,
                borderLeftColor: colors.danger,
                borderBottomColor: colors.danger,
                borderRightColor: colors.danger,
              }
            : null,
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  input: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  error: { fontSize: 12 },
});
