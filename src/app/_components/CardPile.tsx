import { Card } from '@/domain/cards.type';
import { CardComponent, type ClickableAreasProps } from './Card';
import { useState } from 'react';

export default function CardPile<X extends Card>({
  cards,
  clickProps,
  vertical,
}: {
  cards: X[];
  clickProps: ClickableAreasProps<X>;
  vertical?: boolean;
}) {
  const uuid = crypto.randomUUID();
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | undefined>(undefined);

  const overlap = vertical ? '-mb-36' : '-mr-24';

  return <div
    className={`flex flex-wrap ${vertical ? 'flex-col' : ''} gap-4`}
    onMouseLeave={() => setHoveredCardIndex(undefined)}
  >
    {cards
      .map((card, index) => <div
        key={`pile-${uuid}-${index}`}
        onMouseEnter={() => setHoveredCardIndex(index)}
        className={`w-fit ${hoveredCardIndex === index ? '' : overlap}`}
      >
        <CardComponent card={card} clickableAreasProps={clickProps} />
      </div>)}
  </div>
}
