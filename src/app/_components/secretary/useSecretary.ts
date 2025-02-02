import { WebSocketContext } from '@/app/WebSocketContext';
import { isBlinkblade } from '@/domain/blinkblade/class';
import type { Card } from '@/domain/cards.type';
import { BlinkbladeSpeed } from '@/domain/secretary/game.state';
import { useClassHook } from '@/stores/class.store';
import { getGameState } from '@/stores/game.store';
import { use } from 'react';

export default function useSecretary<X extends Card>() {
  const {
    isConnected,
    update: updateGameState,
  } = use(WebSocketContext);
  const currentClass = useClassHook();

  const updateInitiative = (initiative: number) => {
    updateGameState && updateGameState({ initiative }, ["setInitiative", `"${initiative}"`]);
  }

  const setInitiative = ({ initiative }: X) => {
    if (!updateGameState || !currentClass) return;

    if (isBlinkblade(currentClass)) {
      const currentSpeed = getGameState()
        ?.characters
        .find(({ name }) => name === currentClass.name.toLowerCase())
        ?.identity;
      if (currentSpeed === BlinkbladeSpeed.SLOW) {
        return updateInitiative(initiative + 30);
      }
    }

    updateInitiative(initiative);
  };

  const setInactive = () => {
    if (!updateGameState || !currentClass) return;

    updateGameState({ active: false, off: true }, ["unsetActive"]);
  }

  return {
    isConnected,
    setInitiative,
    setInactive,
  };
}
