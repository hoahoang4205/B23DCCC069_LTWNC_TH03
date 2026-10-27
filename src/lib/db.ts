import fs from 'fs/promises';
import path from 'path';
import type { Database, Deadline, Subject } from '@/types';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function getDb(): Promise<Database> {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data) as Database;
}

export async function saveDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getDeadlines(): Promise<Deadline[]> {
  const db = await getDb();
  return db.deadlines;
}

export async function getDeadlineById(id: string): Promise<Deadline | undefined> {
  const db = await getDb();
  return db.deadlines.find((d) => d.id === id);
}

export async function getSubjects(): Promise<Subject[]> {
  const db = await getDb();
  return db.subjects;
}

export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const db = await getDb();
  return db.subjects.find((s) => s.slug === slug);
}

export async function getDeadlinesBySubject(slug: string): Promise<Deadline[]> {
  const db = await getDb();
  return db.deadlines.filter((d) => d.subjectSlug === slug);
}
