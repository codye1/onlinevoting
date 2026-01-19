import { SegmentedControl } from '@components/SegmentedControl';
import moon from '@public/moon.svg';
import sun from '@public/sun.svg';
import { useEffect, useState } from 'react';

type ThemeVariant = 'light' | 'dark';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<ThemeVariant>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <SegmentedControl
      items={[
        { icon: sun, value: 'light' },
        { icon: moon, value: 'dark' },
      ]}
      value={theme}
      onChange={(value) => setTheme(value as ThemeVariant)}
    />
  );
};

export default ThemeSwitcher;
