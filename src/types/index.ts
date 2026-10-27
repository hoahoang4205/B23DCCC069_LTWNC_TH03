export type Role = 'guest' | 'user' | 'admin';

export interface Subject {
  slug: string;
  name: string;
}

export interface Deadline {
  id: string;
  subjectSlug: string;
  title: string;
  description?: string;
  dueDate: string;
  completedBy: string[];
}

export interface Database {
  subjects: Subject[];
  deadlines: Deadline[];
}
