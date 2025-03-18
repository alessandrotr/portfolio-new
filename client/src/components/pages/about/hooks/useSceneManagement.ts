import { useEffect } from 'react';
import store from '../../../../appStore';

type SceneId = 'who' | 'berlin' | 'naples' | 'what' | 'hobbies' | null;

/**
 * Custom hook to manage 3D scene transitions
 *
 * @param currentSceneId - The ID of the current scene to display
 */

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
