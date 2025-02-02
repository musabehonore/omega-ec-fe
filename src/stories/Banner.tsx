/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';

interface BannerProps {
  variant?: 'info' | 'congrats' | 'documentation' | 'danger';
  children: ReactNode;
}

export default function Banner({ children }: BannerProps) {
  return <aside>{children}</aside>;
}
