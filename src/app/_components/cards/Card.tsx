'use client';

import { Card } from '@/domain/cards.type';
import { domAnimation, LazyMotion } from 'framer-motion';
import * as m from 'framer-motion/m';
import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import ActionWheel, { type WheelAction } from './ActionWheel';
import EnhanceSticker from './Enhance/EnhanceSticker';

export function CardComponent<X extends Card>({
  card,
  children,
  actions = [],
  mapName,
}: {
  card: X;
  children?: ReactNode;
  actions?: WheelAction[];
  mapName?: string;
}) {
  const [isActionWheelOpen, setIsActionWheelOpen] = useState(false);

  const toggleWheel = () => setIsActionWheelOpen(!isActionWheelOpen);

  const onClickCard = () => {
    if (actions.length === 0) return;
    if (actions.length === 1) {
      actions[0].onClick();
      return;
    }
    toggleWheel();
  };

  return <LazyMotion features={domAnimation}>
    <m.div
      onClick={onClickCard}
      className='relative'
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
    >
      <ActionWheel isOpen={isActionWheelOpen} actions={actions} />
      {children}
      <Image
        useMap={`#${mapName}`}
        src={card.path}
        alt={`card ${card.name}`}
        width={143}
        height={200}
      />
      {card.availableEnhancements
        ?.map(({ position }, index) => !!card.enhancements?.[index]
          && <EnhanceSticker
            key={`${card.name}-enhance-slot-${index}`}
            enhancement={card.enhancements?.[index]!}
            position={position}
          />)}
    </m.div>
  </LazyMotion>;
}