import { Category, Unit } from './study-item.entity';

export const CATEGORY_UNITS: Record<Category, Unit[]> = {
  book: ['pages', '%'],
  course: ['modules', '%'],
  practice: ['hours'],
};
