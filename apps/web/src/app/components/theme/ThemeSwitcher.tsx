"use client";

import { defaultThemes } from "@/src/app/lib/theme/themes";
import { useTheme } from "@/src/app/lib/theme/useTheme";

export function ThemeSwitcher() {
  const { setPrimaryColor } = useTheme();

  return (
    <div className='flex gap-2'>
      {defaultThemes.map((t) => (
        <button
          key={t.name}
          className='w-6 h-6 rounded-full border-2 border-gray-300'
          style={{ backgroundColor: t.primary }}
          onClick={() => setPrimaryColor(t.primary)}
        />
      ))}
    </div>
  );
}
