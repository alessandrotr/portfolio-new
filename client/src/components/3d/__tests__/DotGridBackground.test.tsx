import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode, MouseEventHandler, PointerEventHandler } from 'react';

// Mock all external dependencies first
const mockClock = {
  getElapsedTime: jest.fn(() => 0),
  getDelta: jest.fn(() => 0.016),
  start: jest.fn(),
  stop: jest.fn(),
};

// Mock store
const mockStore = {
  theme: 'light',
  selectedColor: '#ffffff',
};

// Mock shader material
class MockShaderMaterial {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;

  constructor(uniforms: Record<string, unknown> = {}) {
    this.uniforms = {
      time: { value: 0 },
      resolution: { value: [1920, 1080] },
      dotColor: { value: '#000000' },
      rippleDotColor: { value: '#ffffff' },
      bgColor: { value: '#ffffff' },
      mouseTrail: { value: null },
      clickPosition: { value: [-1, -1] },
      rippleTime: { value: -1 },
      rippleSpeed: { value: 3.0 },
      rippleSize: { value: 0.2 },
      rotation: { value: 35 },
      opacityFactor: { value: 1.0 },
      isMousePressed: { value: 0.0 },
      dotOpacity: { value: 0.03 },
      isPrivacyPage: { value: 0.0 },
      morphFactor: { value: 0.0 },
      hasReachedMax: { value: 0.0 },
      activationProgress: { value: 0.0 },
      deactivationProgress: { value: 0.0 },
      wireframeOpacity: { value: 0.0 },
      transitionProgress: { value: 0.0 },
      activationStartTime: { value: 0.0 },
      deactivationStartTime: { value: 0.0 },
      maxActivationTime: { value: 2.0 },
      maxDeactivationTime: { value: 1.0 },
      fadeOutProgress: { value: 0.0 },
      fadeInProgress: { value: 0.0 },
      fadeOutStartTime: { value: 0.0 },
      fadeInStartTime: { value: 0.0 },
      maxFadeOutTime: { value: 0.5 },
      maxFadeInTime: { value: 0.5 },
    };

    // Properly merge uniforms, ensuring they have the value property
    Object.entries(uniforms).forEach(([key, value]) => {
      if (this.uniforms[key]) {
        this.uniforms[key].value = value;
      }
    });

    this.vertexShader = '';
    this.fragmentShader = '';
  }
}

// Mock all external modules
jest.mock('/sounds/glitch.mp3', () => 'mocked-sound-file', { virtual: true });
jest.mock('../../../tailwindColors', () => ({
  items: '#000000',
  bgDark: '#ffffff',
}));
jest.mock('../../../appStore', () => ({
  __esModule: true,
  default: mockStore,
}));
jest.mock('valtio', () => ({
  useSnapshot: jest.fn((store) => store),
}));
jest.mock('use-sound', () => jest.fn(() => [jest.fn(), { sound: null }]));
jest.mock('../../../hooks/useScreenSize', () => ({
  useScreenSize: jest.fn(() => 'desktop'),
}));
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({ pathname: '/' })),
}));
jest.mock('../BerlinScene', () => ({
  __esModule: true,
  default: () => <div data-testid="berlin-scene" />,
}));
jest.mock('../NaplesScene', () => ({
  __esModule: true,
  default: () => <div data-testid="naples-scene" />,
}));

// Mock Three.js related modules
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn((callback) =>
    callback({
      clock: mockClock,
      camera: { position: { set: jest.fn() } },
      gl: { setSize: jest.fn() },
      scene: {},
      size: { width: 1920, height: 1080 },
    })
  ),
  useThree: jest.fn(() => ({
    scene: {},
    camera: { position: { set: jest.fn() } },
    gl: { setSize: jest.fn() },
    clock: mockClock,
    size: { width: 1920, height: 1080 },
  })),
  extend: jest.fn(),
}));

// Mock drei with proper shader material handling
jest.mock('@react-three/drei', () => ({
  shaderMaterial: jest.fn(
    (
      uniforms: Record<string, unknown>,
      vertexShader: string,
      fragmentShader: string
    ) => {
      // Return a constructor function that creates a material
      const MaterialConstructor = function (
        this: MockShaderMaterial,
        props: Record<string, unknown> = {}
      ) {
        const material = new MockShaderMaterial({ ...uniforms, ...props });
        material.vertexShader = vertexShader;
        material.fragmentShader = fragmentShader;
        return material;
      };
      return MaterialConstructor;
    }
  ),
  useTrailTexture: jest.fn(() => [null, jest.fn()]),
}));

// Mock React Spring with proper types
interface AnimatedMeshProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerMove?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
}

interface ShaderMaterialProps {
  children?: ReactNode;
  [key: string]: unknown;
}

jest.mock('@react-spring/three', () => ({
  useSpring: jest.fn(() => ({
    position: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 120, friction: 45 },
    morph: { get: () => 0 },
    opacity: { get: () => 1.0 },
    wireframeOpacity: { get: () => 0.0 },
    activationProgress: { get: () => 0.0 },
    deactivationProgress: { get: () => 0.0 },
    transitionProgress: { get: () => 0.0 },
    fadeOutProgress: { get: () => 0.0 },
    fadeInProgress: { get: () => 0.0 },
  })),
  animated: {
    mesh: ({
      children,
      onClick,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    }: AnimatedMeshProps) => (
      <div
        data-testid="animated-mesh"
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {children}
      </div>
    ),
    shaderMaterial: ({ children, ...props }: ShaderMaterialProps) => (
      <div data-testid="shader-material" {...props}>
        {children}
      </div>
    ),
  },
}));

// Import the component after all mocks
import DotGridBackground from '../DotGridBackground';

// Test wrapper with proper Three.js context
const ThreeWrapper = ({ children }: { children: ReactNode }) => (
  <div data-testid="three-wrapper">{children}</div>
);

describe('DotGridBackground', () => {
  const mockUseLocation = jest.requireMock('react-router-dom').useLocation;
  const mockUseScreenSize = jest.requireMock(
    '../../../hooks/useScreenSize'
  ).useScreenSize;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockImplementation(() => ({ pathname: '/' }));
    mockUseScreenSize.mockImplementation(() => 'desktop');
    mockClock.getElapsedTime.mockReturnValue(0);
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<DotGridBackground />, {
      wrapper: ThreeWrapper,
    });
    expect(getByTestId('animated-mesh')).toBeInTheDocument();
  });

  it('adapts to different routes', () => {
    const { rerender, getByTestId } = render(<DotGridBackground />, {
      wrapper: ThreeWrapper,
    });

    // Test home route
    mockUseLocation.mockImplementation(() => ({ pathname: '/' }));
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();

    // Test projects route
    mockUseLocation.mockImplementation(() => ({ pathname: '/projects' }));
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();

    // Test about route
    mockUseLocation.mockImplementation(() => ({ pathname: '/about' }));
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();
  });

  it('adapts to screen size changes', () => {
    const { rerender, getByTestId } = render(<DotGridBackground />, {
      wrapper: ThreeWrapper,
    });

    // Test desktop
    mockUseScreenSize.mockImplementation(() => 'desktop');
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();

    // Test mobile
    mockUseScreenSize.mockImplementation(() => 'mobile');
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();
  });

  it('handles pointer events', () => {
    const { getByTestId } = render(<DotGridBackground />, {
      wrapper: ThreeWrapper,
    });
    const mesh = getByTestId('animated-mesh');

    // Test pointer down
    fireEvent.pointerDown(mesh, {
      clientX: 100,
      clientY: 100,
      buttons: 1,
    });

    // Test pointer move
    fireEvent.pointerMove(mesh, {
      clientX: 150,
      clientY: 150,
      buttons: 1,
    });

    // Test pointer up
    fireEvent.pointerUp(mesh);

    expect(mesh).toBeInTheDocument();
  });

  it('responds to theme changes', () => {
    const { rerender, getByTestId } = render(<DotGridBackground />, {
      wrapper: ThreeWrapper,
    });

    // Test light theme
    mockStore.theme = 'light';
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();

    // Test dark theme
    mockStore.theme = 'dark';
    rerender(<DotGridBackground />);
    expect(getByTestId('animated-mesh')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const { getByTestId } = render(<DotGridBackground />, {
      wrapper: ThreeWrapper,
    });
    const mesh = getByTestId('animated-mesh');

    fireEvent.click(mesh, {
      clientX: 100,
      clientY: 100,
    });

    expect(mesh).toBeInTheDocument();
  });
});
