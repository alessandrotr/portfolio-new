import { SphereBehavior } from './types';

export const sphereBehaviors: Record<string, SphereBehavior> = {
  '/': {
    x: 0,
    y: 0,
    z: 0,
    scale: 0.14,
    opacity: 1.0,
    springConfig: {
      mass: 1,
      tension: 120,
      friction: 45,
    },
  },
  '/projects': {
    x: 0,
    y: 0.2,
    z: -0.1,
    scale: 0.16,
    opacity: 0.8,
    springConfig: {
      mass: 1.2,
      tension: 100,
      friction: 50,
    },
  },
  '/about': {
    x: 0,
    y: -10,
    z: -3,
    scale: 0.2,
    opacity: 0.5,
    springConfig: {
      mass: 0.8,
      tension: 140,
      friction: 40,
    },
  },
  '/contact': {
    x: 0,
    y: -0.6,
    z: -0.5,
    scale: 0.28,
    opacity: 0.2,
    springConfig: {
      mass: 0.8,
      tension: 140,
      friction: 40,
    },
  },
  '/privacy-policy': {
    x: 0,
    y: -0.6,
    z: -0.5,
    scale: 0.25,
    opacity: 0.2,
    springConfig: {
      mass: 1,
      tension: 120,
      friction: 45,
    },
  },
};

export const getSphereBehavior = (
  location: string,
  screenSize: string
): SphereBehavior => {
  // Remove language prefix if present (e.g., /en/ or /it/)
  const normalizedPath = location.replace(/^\/[a-z]{2}\//, '/');

  // Check for about routes first
  if (normalizedPath.startsWith('/about')) {
    return sphereBehaviors['/about'] || sphereBehaviors['/'];
  }

  // For other routes, use exact match or fallback to home
  const baseBehavior = sphereBehaviors[normalizedPath] || sphereBehaviors['/'];

  // Adjust scale for mobile
  if (screenSize === 'mobile' && normalizedPath !== '/privacy-policy') {
    return {
      ...baseBehavior,
      scale: 0.29,
    };
  }

  return baseBehavior;
};
