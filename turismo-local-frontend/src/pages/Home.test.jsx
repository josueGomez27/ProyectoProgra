import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // Arregla el error del componente <Link>
import { getAllTowns } from '../services/townService';
import Home from './Home';

// 1. Mock de i18next / Traducciones
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'home.kicker': 'Descubre',
        'home.title': 'Turismo Local',
        'home.description': 'Encuentra tu próximo destino',
        'home.searchLabel': 'Buscar pueblos...',
        'home.searchPlaceholder': 'Introduce un pueblo...',
        'home.loadError': 'Error cargando pueblos',
        'home.loading': 'Cargando destinos...',
        'home.noTowns': 'No se encontraron pueblos.',
        'buttons.search': 'Buscar',
        'buttons.retry': 'Reintentar'
      };
      return translations[key] || key;
    },
  }),
}));

// 2. Mock del servicio
vi.mock('../services/townService', () => ({
  getAllTowns: vi.fn(),
}));

// Función helper para renderizar el componente protegido por el Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Home Component', () => {
  const mockPueblos = [
    { id: 1, name: 'Liberia', active: true, province: 'Guanacaste' },
    { id: 2, name: 'Nicoya', active: true, province: 'Guanacaste' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup(); // Evita la duplicación de inputs y componentes en el DOM
  });

  test('muestra un estado de carga mientras se obtienen los pueblos', async () => {
    vi.mocked(getAllTowns).mockImplementationOnce(() => new Promise(() => {}));

    renderWithRouter(<Home />);

    expect(screen.getByText('Cargando destinos...')).toBeTruthy();
  });

  test('renderiza la lista de pueblos activos devueltos por el servicio', async () => {
    vi.mocked(getAllTowns).mockResolvedValueOnce(mockPueblos);

    renderWithRouter(<Home />);

    // Esperamos de forma asíncrona a que el spinner desaparezca y cargue la data
    expect(await screen.findByText('Liberia')).toBeTruthy();
    expect(await screen.findByText('Nicoya')).toBeTruthy();
  });

  test('actualiza el valor del buscador', async () => {
    vi.mocked(getAllTowns).mockResolvedValueOnce(mockPueblos);
    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Introduce un pueblo...');
    await userEvent.type(input, 'Liberia');

    expect(input.value).toBe('Liberia');
  });

  test('muestra un mensaje de error si la llamada al servicio falla', async () => {
    vi.mocked(getAllTowns).mockRejectedValueOnce(new Error('Async Error'));

    renderWithRouter(<Home />);

    expect(await screen.findByText('Error cargando pueblos')).toBeTruthy();
  });

  test('muestra un mensaje informando que no hay pueblos si la lista está vacía', async () => {
    vi.mocked(getAllTowns).mockResolvedValueOnce([]);

    renderWithRouter(<Home />);

    expect(await screen.findByText('No se encontraron pueblos.')).toBeTruthy();
  });

  test('filtra los pueblos en pantalla dinámicamente al escribir en el buscador', async () => {
    vi.mocked(getAllTowns).mockResolvedValueOnce(mockPueblos);
    renderWithRouter(<Home />);

    // Verificamos que carguen inicialmente
    expect(await screen.findByText('Liberia')).toBeTruthy();
    expect(await screen.findByText('Nicoya')).toBeTruthy();

    const input = screen.getByPlaceholderText('Introduce un pueblo...');
    await userEvent.type(input, 'Liberia');

    // Verificamos el filtrado en tiempo real
    await waitFor(() => {
      expect(screen.getByText('Liberia')).toBeTruthy();
      expect(screen.queryByText('Nicoya')).toBeNull();
    });
  });
});