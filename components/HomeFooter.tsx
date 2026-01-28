'use client';

import { version } from '../data/home';

export default function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__container">
        <p className="home-footer__version">{version}</p>
      </div>
    </footer>
  );
}
