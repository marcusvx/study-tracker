import React from 'react';
import { Category } from '../../types/study';
import { IconBook } from './IconBook';
import { IconBriefcase } from './IconBriefcase';
import { IconCode } from './IconCode';
import { IconProps } from './Index';

export const categoryMeta: Record<
  Category,
  { labelKey: string; Icon: React.FC<IconProps> }
> = {
  book: {
    labelKey: 'category.book',
    Icon: IconBook,
  },
  course: {
    labelKey: 'category.course',
    Icon: IconCode,
  },
  practice: {
    labelKey: 'category.practice',
    Icon: IconBriefcase,
  },
};
