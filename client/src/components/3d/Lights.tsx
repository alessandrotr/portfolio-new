import { useSnapshot } from 'valtio';
import store from '../../appStore';

const Lights = () => {
  const snap = useSnapshot(store);

  return (
    <>
      <ambientLight intensity={2.75} />
      {snap.pageActive === 'HomePage' && (
        <>
          <pointLight
            castShadow
            distance={30}
            position={[-17, -4, 0]}
            intensity={30}
            color={'#ffffff'}
          />
          <pointLight
            castShadow
            distance={30}
            position={[-10, -4, 0]}
            intensity={30}
            color={'#ffffff'}
          />
          <pointLight
            castShadow
            distance={30}
            position={[-6, -4, 0]}
            intensity={30}
            color={'#ffffff'}
          />
        </>
      )}
    </>
  );
};

export default Lights;
