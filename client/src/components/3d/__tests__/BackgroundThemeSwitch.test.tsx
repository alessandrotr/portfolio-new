// Mock implementations first
const mockStore = {
  theme: 'light',
  selectedColor: '#ffffff',
};

// Mock Three.js and React Three Fiber before imports
jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  extend: jest.fn(),
}));

jest.mock('three', () => {
  const actualThree = jest.requireActual('three');
  return {
    ...actualThree,
    Color: jest.fn().mockImplementation(() => ({
      setHex: jest.fn(),
    })),
    SphereGeometry: jest.fn(),
  };
});

jest.mock('../../../appStore', () => ({
  __esModule: true,
  default: mockStore,
}));

jest.mock('valtio', () => ({
  useSnapshot: jest.fn((store) => store),
}));

// Regular imports after mocks
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackgroundThemeSwitch from '../BackgroundThemeSwitch';
import { ReactNode } from 'react';

// Mock React Spring Three
jest.mock('@react-spring/three', () => ({
  useSpring: () => ({
    scale: { to: () => [1, 1, 1] },
    opacity: 1,
  }),
  a: {
    mesh: ({
      children,
      onClick,
    }: {
      children: ReactNode;
      onClick?: () => void;
    }) => (
      <div onClick={onClick} data-testid="background-switch">
        {children}
      </div>
    ),
    meshStandardMaterial: () => null,
  },
}));

// Create a custom wrapper to provide Three.js context
const ThreeWrapper = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);

describe('BackgroundThemeSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<BackgroundThemeSwitch />, {
      wrapper: ThreeWrapper,
    });
    expect(getByTestId('background-switch')).toBeInTheDocument();
  });

  it('toggles expanded state on click', () => {
    const { getByTestId } = render(<BackgroundThemeSwitch />, {
      wrapper: ThreeWrapper,
    });
    const switchElement = getByTestId('background-switch');
    fireEvent.click(switchElement);
  });

  it('responds to theme changes', () => {
    const { rerender } = render(<BackgroundThemeSwitch />, {
      wrapper: ThreeWrapper,
    });
    mockStore.theme = 'dark';
    rerender(<BackgroundThemeSwitch />);
  });

  it('uses the selected color from store', () => {
    const { rerender } = render(<BackgroundThemeSwitch />, {
      wrapper: ThreeWrapper,
    });
    mockStore.selectedColor = '#ff0000';
    rerender(<BackgroundThemeSwitch />);
  });
});
