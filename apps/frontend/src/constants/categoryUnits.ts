import { Category, Unit } from '../types/study';

export const CATEGORY_UNITS: Record<Category, Unit[]> = {
  book: ['pages', '%'],
  course: ['modules', '%'],
  practice: ['hours'],
};
