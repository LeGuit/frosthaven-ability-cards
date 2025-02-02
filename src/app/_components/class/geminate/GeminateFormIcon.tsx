import { GeminateForm } from '@/domain/geminate/cards';
import Image from 'next/image';

const meleeFormPath = '/geminate/icons/fh-geminate-melee-color-icon.png';
const rangedFormPath = '/geminate/icons/fh-geminate-ranged-color-icon.png';

export default function GeminateFormIcon({
  form,
}: {
  form: GeminateForm;
}) {
  const formPath = form === GeminateForm.melee
    ? meleeFormPath
    : rangedFormPath;

  return <Image
    src={formPath}
    alt={`form-${form}`}
    width={33}
    height={60}
  />;
}