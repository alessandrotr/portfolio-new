import { useMemo } from 'react';
import { TFunction } from 'i18next';
import { SECTION_IDS } from '../constants';
import { Section } from '../types';

interface UseSectionsProps {
  t: TFunction;
}

/**
 * Custom hook for managing section content and translations in the About page.
 * Handles the creation and management of section data including:
 * - Translation of section titles and content
 * - Mapping of section IDs to corresponding 3D scenes
 * - Content formatting and structure
 *
 * The hook processes translations for each section and creates a structured
 * section object with:
 * - Translated title
 * - Formatted content with paragraphs
 * - Associated 3D scene ID
 *
 * @param props - Hook props containing:
 *   - t: Translation function from i18next
 * @returns Array of section objects, each containing:
 *   - id: Unique section identifier
 *   - title: Translated section title
 *   - content: Translated and formatted section content
 *   - sceneId: Associated 3D scene identifier (if applicable)
 */

export const useSections = ({ t }: UseSectionsProps): Section[] => {
  return useMemo(
    () =>
      SECTION_IDS.map((id) => {
        const content = (
          <div>
            {(
              t(`aboutPage.sections.${id}.content`, {
                returnObjects: true,
              }) as string[]
            ).map((text: string, index: number) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        );

        return {
          id,
          title: t(`aboutPage.sections.${id}.title`),
          content,
          sceneId:
            id === 'who'
              ? 'who'
              : id === 'live'
              ? 'berlin'
              : id === 'from'
              ? 'naples'
              : id === 'what'
              ? 'what'
              : id === 'hobbies'
              ? 'hobbies'
              : undefined,
        };
      }),
    [t]
  );
};
