export type Category = 'book' | 'cert' | 'course' | 'work';
export type Unit = 'pages' | '%' | 'hours' | 'modules';
export type Status = 'active' | 'paused' | 'done';

export interface LogEntry {
  date: string;
  amount: number;
  minutes: number;
  note?: string;
}

export interface StudyItem {
  id: string;
  title: string;
  category: Category;
  unit: Unit;
  totalScope: number;
  currentProgress: number;
  deadline?: string;
  cadenceDays: number;
  sessionMinutes: number;
  reminderTime?: string;
  notificationsOn: boolean;
  status: Status;
  log: LogEntry[];
}

export type View = 'dashboard' | 'detail' | 'create' | 'settings';
export type FilterTab = 'all' | 'active' | 'paused' | 'done';
