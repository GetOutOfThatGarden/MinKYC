import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'subtext' | 'caption';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = theme.colors.textMain,
  weight,
  align = 'auto',
  style,
  children,
  ...rest
}) => {
  // Determine standard styling based on variant
  let fontSize = theme.typography.sizes.base;
  let defaultWeight: any = theme.typography.weights.regular;
  
  switch (variant) {
    case 'h1':
      fontSize = theme.typography.sizes.xxxl;
      defaultWeight = theme.typography.weights.bold;
      break;
    case 'h2':
      fontSize = theme.typography.sizes.xxl;
      defaultWeight = theme.typography.weights.semibold;
      break;
    case 'h3':
      fontSize = theme.typography.sizes.lg;
      defaultWeight = theme.typography.weights.semibold;
      break;
    case 'body':
      fontSize = theme.typography.sizes.base;
      defaultWeight = theme.typography.weights.regular;
      break;
    case 'subtext':
      fontSize = theme.typography.sizes.sm;
      defaultWeight = theme.typography.weights.regular;
      if (color === theme.colors.textMain) color = theme.colors.textDim;
      break;
    case 'caption':
      fontSize = theme.typography.sizes.xs;
      defaultWeight = theme.typography.weights.medium;
      if (color === theme.colors.textMain) color = theme.colors.textLight;
      break;
  }

  // Override mapped defaults with specific props if passed
  const finalWeight = weight ? theme.typography.weights[weight] : defaultWeight;

  return (
    <Text
      style={[
        {
          fontSize,
          fontWeight: finalWeight,
          color,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
