import { useMemo } from 'react';
import { TFunction } from 'i18next';
import { SECTION_IDS } from '../constants';
import { Section } from '../types';

interface UseSectionsProps {
  t: TFunction;
}

/**
 * Custom hook to manage sections data and translations
 *
 * @param props - Hook props containing translation function
 * @returns Array of sections with translated content
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
            id === 'live' ? 'berlin' : id === 'from' ? 'naples' : undefined,
        };
      }),
    [t]
  );
};
