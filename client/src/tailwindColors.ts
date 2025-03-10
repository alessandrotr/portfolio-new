import resolveConfig from 'tailwindcss/resolveConfig';
import config from '../tailwind.config.ts';

const fullConfig = resolveConfig(config);

// Define tailwindColors to hold hex values
const tailwindColors: { [key: string]: string | { [shade: string]: string } } =
  {};

// Cast colors to a more permissive type (avoiding direct indexing issues)
const colors = fullConfig.theme.colors as
  | Record<string, string | Record<string, string>>
  | unknown;

// Check if colors is valid and extract Tailwind color hex codes
if (typeof colors === 'object' && colors !== null) {
  Object.keys(colors).forEach((key) => {
    const color = (colors as Record<string, string | Record<string, string>>)[
      key
    ];

    if (typeof color === 'string') {
      tailwindColors[key] = color; // Store hex code as a string
    } else {
      tailwindColors[key] = Object.fromEntries(
        Object.entries(color).map(([shade, shadeColor]) => [shade, shadeColor])
      );
    }
  });
}

export default tailwindColors;
