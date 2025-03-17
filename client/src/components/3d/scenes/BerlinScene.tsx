import Fernsehturm from '../monuments/Fernsehturm';
import BrandenburgGate from '../monuments/BrandenburgGate';

export default function BerlinScene({ visible = false }) {
  return (
    <group>
      <Fernsehturm position={[4, -1, -4]} scale={0.4} visible={visible} />
      <BrandenburgGate
        position={[-4, -1, -3.75]}
        scale={0.5}
        visible={visible}
      />
    </group>
  );
}
