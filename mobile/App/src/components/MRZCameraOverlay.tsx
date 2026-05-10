import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppText } from './AppText';
import { theme } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// MRZ area is usually at the bottom of the passport page
// TD3 (Passport) MRZ is 2 lines.
const OVERLAY_WIDTH = width * 0.9;
const OVERLAY_HEIGHT = 100;
const OVERLAY_BOTTOM = 100;

export const MRZCameraOverlay: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Dimmed background */}
      <View style={styles.maskTop} />
      <View style={styles.maskMiddle}>
        <View style={styles.maskSide} />
        <View style={styles.targetBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={styles.maskSide} />
      </View>
      <View style={styles.maskBottom}>
        <View style={styles.instructionPill}>
          <AppText variant="caption" color={theme.colors.surface} weight="semibold">
            Align the 2-line MRZ zone within the frame
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  maskTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  maskMiddle: {
    height: OVERLAY_HEIGHT,
    flexDirection: 'row',
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  targetBox: {
    width: OVERLAY_WIDTH,
    height: OVERLAY_HEIGHT,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  maskBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 20,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: theme.colors.secondary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  instructionPill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadii.round,
  },
});
