export const TOASTER_CONFIG = {
  position: 'top-center' as const,
  toastOptions: {
    duration: 3000,
    style: {
      background: 'var(--toast-bg)',
      color: 'var(--toast-text)',
      border: '1px solid var(--toast-border)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '0.9vw',
    },
    success: {
      iconTheme: {
        primary: '#4ade80',
        secondary: '#fff',
      },
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  },
} as const;
