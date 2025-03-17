import CastelDellOvo from '../monuments/CastelDellOvo';
import Vesuvius from '../monuments/Vesuvius';

export default function NaplesScene({ visible = false }) {
  return (
    <group>
      <CastelDellOvo position={[4.5, -1, -4]} scale={0.4} visible={visible} />
      <Vesuvius position={[-4.5, -1, -4.5]} scale={0.6} visible={visible} />
    </group>
  );
}
