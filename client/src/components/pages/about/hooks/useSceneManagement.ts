import { useEffect } from 'react';
import store from '../../../../appStore';

/**
 * Custom hook for managing 3D scene transitions in the About page.
 * Handles the activation and deactivation of 3D scenes based on the current section.
 *
 * The hook:
 * - Updates the active scene in the global store when the current section changes
 * - Cleans up by deactivating the scene when the component unmounts
 * - Manages scene transitions between different sections (who, berlin, naples, etc.)
 *
 * @param currentSceneId - The ID of the current scene to display
 *   Possible values: 'who' | 'berlin' | 'naples' | 'what' | 'hobbies' | null
 */

type SceneId = 'who' | 'berlin' | 'naples' | 'what' | 'hobbies' | null;

export const useSceneManagement = (currentSceneId: SceneId): void => {
  useEffect(() => {
    if (store.activeScene !== currentSceneId) {
      store.activeScene = currentSceneId;
    }

    return () => {
      if (store.activeScene === currentSceneId) {
        store.activeScene = null;
      }
    };
  }, [currentSceneId]);
};
