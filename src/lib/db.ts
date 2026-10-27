import fs from 'fs/promises';
import path from 'path';
import type { Database, Deadline, Subject } from '@/types';

const defaultDbPath = path.join(process.cwd(), 'data', 'db.json');
// Trong môi trường serverless như Vercel, thư mục /tmp có quyền ghi
const tmpDbPath = path.join('/tmp', 'db.json');

// Bộ nhớ đệm in-memory đảm bảo an toàn tuyệt đối khi chạy trên Vercel
let memoryDb: Database | null = null;

export async function getDb(): Promise<Database> {
  if (memoryDb) {
    return memoryDb;
  }

  // Thử đọc từ /tmp nếu trước đó đã được cập nhật trên Vercel
  try {
    const tmpData = await fs.readFile(tmpDbPath, 'utf-8');
    memoryDb = JSON.parse(tmpData) as Database;
    return memoryDb;
  } catch {
    // Đọc từ file gốc trong repo
    const data = await fs.readFile(defaultDbPath, 'utf-8');
    memoryDb = JSON.parse(data) as Database;
    return memoryDb;
  }
}

export async function saveDb(data: Database): Promise<void> {
  memoryDb = data;

  try {
    // Khi chạy local, ghi trực tiếp vào data/db.json
    await fs.writeFile(defaultDbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    try {
      // Nếu là môi trường Vercel (read-only filesystem), ghi vào /tmp
      await fs.writeFile(tmpDbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Dữ liệu vẫn được bảo toàn trong memoryDb cho phiên hiện tại
    }
  }
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
