import { type Card } from '@/domain/cards.type';
import { GeminateForm } from '@/domain/geminate/cards';
import { createJSONStorage, persist } from 'zustand/middleware';
import { indexedDBStorage } from './indexed-db.storage';
import { create } from 'zustand';
import type { Identity } from '@/domain/frosthaven-class.type';

type AbilityCardsState = {
  level: number;
  cards: Card[];
  availableCards: Card[];
  states: Card[][];
  currentStateIndex: number;
  currentForm: Identity;
}

type AbilityCardsActions = {
  setLevel: (level: number) => void;
  selectCards: (cards: Card[]) => void;
  enhanceCard: (card: Card) => void;
  validateCardSelection: () => void;
  setStateIndex: (index: number) => void;
  updateStates: <X extends Card>(states: X[][]) => void;
  setForm: (form: Identity) => void;
  reset: () => void;
}

export type PersistedCard = Pick<Card, 'name' | 'status' | 'tokenPosition' | 'enhancements'>;
export type PersistedState = {
  level: number;
  cards: PersistedCard[];
  availableCards: PersistedCard[];
  states: PersistedCard[][];
  currentStateIndex: number;
  currentForm: Identity;
};
export function partializeCard<X extends Card>({
  name,
  status,
  tokenPosition,
  enhancements,
}: X): PersistedCard {
  return {
    name,
    status,
    tokenPosition,
    enhancements,
  };
}

export const initialState: AbilityCardsState = {
  level: 1,
  cards: [],
  availableCards: [],
  states: [[]],
  currentStateIndex: 0,
  currentForm: GeminateForm.melee,
}

export const useFrosthavenStore = create<AbilityCardsState & AbilityCardsActions>()(
  persist(
    (set) => ({
      ...initialState,
      setLevel: (level: number) => set({ level }),
      selectCards: (cards: Card[]) => set({ cards, states: [cards], currentStateIndex: 0 }),
      validateCardSelection: () => set(({ cards }) => ({ states: [cards], currentStateIndex: 0 })),
      enhanceCard: (card: Card) => set(({ cards, availableCards }) => ({
        cards: cards.with(cards.findIndex(({ name }) => name === card.name), card),
        availableCards: availableCards.with(availableCards.findIndex(({ name }) => name === card.name), card),
      })),
      updateStates: <X extends Card>(states: X[][]) => set({ states, currentStateIndex: states.length - 1 }),
      setStateIndex: (index: number) => set({ currentStateIndex: index }),
      setForm: (currentForm: Identity) => set({ currentForm }),
      reset: async () => {
        const stateString = await indexedDBStorage.getItem('');
        if (!stateString) {
          return set(initialState);
        }
        const { state } = JSON.parse(stateString) as { state: AbilityCardsState };
        set(state);
      },
    }),
    {
      name: 'fh-ability-cards',
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({
        level: state.level,
        cards: state.cards.map(partializeCard),
        availableCards: state.availableCards.map(partializeCard),
        states: state.states.map((state) => state.map(partializeCard)),
        currentStateIndex: state.currentStateIndex,
        currentForm: state.currentForm,
      }),
    }
  ),
);
