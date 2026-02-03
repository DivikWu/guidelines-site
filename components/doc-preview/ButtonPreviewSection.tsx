'use client';

import { useState } from 'react';
import DocComponentPreview from './DocComponentPreview';
import ButtonDemo from './ButtonDemo';
import {
  BUTTON_TYPES,
  PLATFORMS,
  getButtonStyleCode,
} from './button-demo-code';

export default function ButtonPreviewSection() {
  const [activeButtonType, setActiveButtonType] = useState<string>(BUTTON_TYPES[0].id);
  const [activePlatform, setActivePlatform] = useState<'web' | 'mobile'>(PLATFORMS[0].id as 'web' | 'mobile');

  const code = getButtonStyleCode(activeButtonType);

  const preview = (
    <ButtonDemo buttonType={activeButtonType} platform={activePlatform} />
  );

  return (
    <DocComponentPreview
      tabsTop={[...BUTTON_TYPES]}
      activeTop={activeButtonType}
      onTopChange={setActiveButtonType}
      tabsBottom={[...PLATFORMS]}
      activeBottom={activePlatform}
      onBottomChange={(id) => setActivePlatform(id as 'web' | 'mobile')}
      code={code}
    >
      {preview}
    </DocComponentPreview>
  );
}
