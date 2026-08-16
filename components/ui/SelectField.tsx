import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function SelectField({ label, value, placeholder, options, onChange, disabled }: Props) {
  const { colors, edge } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.accentText }]}>{label}</Text>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        style={[styles.trigger, { backgroundColor: colors.surface }, edge.pressed, disabled && styles.triggerDisabled]}>
        <Text style={[styles.value, { color: value ? colors.text : colors.placeholder }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Brand.accent} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.popup, { backgroundColor: colors.surface }, edge.raised]}
            onPress={(e) => e.stopPropagation()}>
            <View style={[styles.popupHeader, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.popupTitle, { color: colors.text }]}>{label}</Text>
              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={10}
                style={[styles.closeButton, { backgroundColor: colors.base }, edge.raised]}>
                <Ionicons name="close" size={16} color={colors.text} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              style={styles.list}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.divider }]} />}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      { color: item === value ? colors.accentText : colors.text },
                      item === value && styles.optionTextActive,
                    ]}>
                    {item}
                  </Text>
                  {item === value && <Ionicons name="checkmark" size={18} color={colors.accentText} />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  trigger: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerDisabled: { opacity: 0.55 },
  value: { fontSize: 15, flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4,13,18,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  popup: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '65%',
    borderRadius: 26,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  popupTitle: { fontSize: 16, fontWeight: '700' },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingHorizontal: 20, marginTop: 4 },
  separator: { height: 1 },
  option: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: { fontSize: 15 },
  optionTextActive: { fontWeight: '700' },
});
