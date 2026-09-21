import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="game-controller-outline" size={26} color="#818CF8" />
            <Text style={styles.title}>HOW TO PLAY</Text>
          </View>

          <Text style={styles.leadText}>
            “Tap the screen to make the face fly upward. Avoid the face towers and get the highest score.”
          </Text>

          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="hand-left-outline" size={20} color="#60A5FA" />
              </View>
              <View style={styles.ruleTextGroup}>
                <Text style={styles.ruleTitle}>Tap Anywhere</Text>
                <Text style={styles.ruleDesc}>
                  Every tap makes your floating face flap upward against gravity.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Ionicons name="warning-outline" size={20} color="#EF4444" />
              </View>
              <View style={styles.ruleTextGroup}>
                <Text style={styles.ruleTitle}>Face Towers</Text>
                <Text style={styles.ruleDesc}>
                  Navigate safely through the gaps between Friend 2's obstacle towers.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
                <Ionicons name="trophy-outline" size={20} color="#FACC15" />
              </View>
              <View style={styles.ruleTextGroup}>
                <Text style={styles.ruleTitle}>Score Points</Text>
                <Text style={styles.ruleDesc}>
                  Earn +1 point for each obstacle tower you clear. Beat your personal best!
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeBtnText}>GOT IT, LET'S FLY!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3730A3',
    padding: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  leadText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  rulesList: {
    width: '100%',
    gap: 14,
    marginBottom: 24,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleTextGroup: {
    flex: 1,
  },
  ruleTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  ruleDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  closeBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
