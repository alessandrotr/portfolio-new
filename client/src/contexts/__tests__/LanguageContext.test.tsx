// Mock implementations first
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/en/about' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
  language: 'en',
}));

// Regular imports
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '../LanguageContext';
import i18n from '../../i18n';

// Test component that uses the language context
const TestComponent = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="current-language">{currentLanguage}</span>
      <button onClick={() => changeLanguage('it')} data-testid="change-to-it">
        Change to Italian
      </button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.pathname = '/en/about';
  });

  it('provides initial language state', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
  });

  it('changes language and updates URL when changeLanguage is called', async () => {
    render(
      <MemoryRouter initialEntries={['/en/about']}>
        <Routes>
          <Route
            path="/:lang/*"
            element={
              <LanguageProvider>
                <TestComponent />
              </LanguageProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await act(async () => {
      screen.getByTestId('change-to-it').click();
    });

    expect(i18n.changeLanguage).toHaveBeenCalledWith('it');
    expect(screen.getByTestId('current-language')).toHaveTextContent('it');
    expect(mockNavigate).toHaveBeenCalledWith('/it/about');
  });

  it('updates language based on URL changes', async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/en/about']}>
        <Routes>
          <Route
            path="/:lang/*"
            element={
              <LanguageProvider>
                <TestComponent />
              </LanguageProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('current-language')).toHaveTextContent('en');

    // Update mock location before rerender
    mockLocation.pathname = '/de/about';

    await act(async () => {
      rerender(
        <MemoryRouter initialEntries={['/de/about']}>
          <Routes>
            <Route
              path="/:lang/*"
              element={
                <LanguageProvider>
                  <TestComponent />
                </LanguageProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(i18n.changeLanguage).toHaveBeenCalledWith('de');
    expect(screen.getByTestId('current-language')).toHaveTextContent('de');
  });

  it('throws error when useLanguage is used outside provider', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(
        <MemoryRouter>
          <TestComponent />
        </MemoryRouter>
      );
    }).toThrow('useLanguage must be used within a LanguageProvider');

    consoleSpy.mockRestore();
  });
});
