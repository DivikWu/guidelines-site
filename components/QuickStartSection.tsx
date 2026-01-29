'use client';

import Link from 'next/link';
import { quickStartCards } from '../data/home';
import SectionTitle from './SectionTitle';
import Icon from './Icon';
import type { QuickStartCard } from '@/lib/content/nav-index';

export default function QuickStartSection({ cards }: { cards?: QuickStartCard[] | null }) {
  const list = cards && cards.length > 0 ? cards : quickStartCards;
  return (
    <section className="quick-start-section">
      <div className="quick-start-section__container">
        <div className="quick-start-section__header">
          <SectionTitle>快速开始</SectionTitle>
          <p className="quick-start-section__description">
            用于定义设计系统的整体结构、核心原则与使用边界，作为所有设计与研发协作的统一入口。
          </p>
        </div>
        <div className="quick-start-grid">
          {list.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="quick-start-card"
            >
              <div className="quick-start-card__icon" aria-hidden="true">
                <div className="quick-start-card__icon-inner">
                  <Icon name={card.iconName} className="quick-start-card__icon-symbol" />
                </div>
              </div>
              <div className="quick-start-card__text">
                <h3 className="quick-start-card__title">{card.title}</h3>
                <p className="quick-start-card__description">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
