import React from 'react';
import { Category } from '../../types/study';
import { IconBook } from './IconBook';
import { IconBriefcase } from './IconBriefcase';
import { IconCert } from './IconCert';
import { IconCode } from './IconCode';
import { IconProps } from './Index';

export const categoryMeta: Record<
  Category,
  { labelKey: string; color: string; bg: string; Icon: React.FC<IconProps> }
> = {
  book: {
    labelKey: 'category.book',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.12)',
    Icon: IconBook,
  },
  cert: {
    labelKey: 'category.cert',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.12)',
    Icon: IconCert,
  },
  course: {
    labelKey: 'category.course',
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.12)',
    Icon: IconCode,
  },
  work: {
    labelKey: 'category.work',
    color: '#34D399',
    bg: 'rgba(52,211,153,0.12)',
    Icon: IconBriefcase,
  },
};
