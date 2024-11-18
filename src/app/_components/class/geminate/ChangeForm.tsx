'use client';

import { GeminateForm } from '@/domain/geminate/cards';
import Button from '../../inputs/Button';
import GeminateFormIcon from './GeminateFormIcon';
import { useFrosthavenStore } from '@/stores/cards.store';
import { useShallow } from 'zustand/shallow';
import useSecretary from '../../secretary/useSecretary';

export default function ChangeForm() {
  const {
    currentForm,
    setForm,
  } = useFrosthavenStore(useShallow((state) => ({
    currentForm: state.currentForm as GeminateForm,
    setForm: state.setForm,
  })));
  const { isConnected, updateIdentity } = useSecretary();

  const changeForm = () => {
    const newForm = currentForm === GeminateForm.melee
      ? GeminateForm.ranged
      : GeminateForm.melee;
    setForm(newForm);

    if (isConnected) {
      updateIdentity(newForm);
    }
  };

  return <Button
    onClick={changeForm}>
    <div className='flex justify-center items-center gap-2 min-h-24'>
      <label>Change form</label>
      <GeminateFormIcon form={currentForm} />
    </div>
  </Button>;
}