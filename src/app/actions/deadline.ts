// src/app/actions/deadline.ts
'use server';

import { auth } from '@/auth';
import { getDb, saveDb } from '@/lib/db';
import { can } from '@/lib/permissions';
import type { Deadline } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type DeadlineActionResult =
  | { success: true; message: string; completed?: boolean }
  | { success: false; error: string };

const idSchema = z.string().regex(/^[1-9]\d*$/, 'ID deadline không hợp lệ.');

const createDeadlineSchema = z.object({
  subjectSlug: z.string().min(1, 'Vui lòng chọn môn học.'),
  title: z.string().trim().min(3, 'Tiêu đề phải có ít nhất 3 ký tự.'),
  description: z.string().max(5000, 'Mô tả không được vượt quá 5000 ký tự.'),
  dueDate: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Hạn nộp không hợp lệ.',
    })
    .refine((value) => Date.parse(value) >= Date.now(), {
      message: 'Hạn nộp không được ở trong quá khứ.',
    }),
});

function getStringField(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === 'string' ? value : undefined;
}

function revalidateDeadlinePages(id: string, subjectSlug?: string): void {
  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${id}`);
  revalidatePath('/deadlines/[id]', 'page');
  revalidatePath('/admin');
  revalidatePath('/');
  if (subjectSlug) {
    revalidatePath(`/subjects/${subjectSlug}`);
  }
}

export async function toggleComplete(formData: FormData): Promise<DeadlineActionResult> {
  const parsedId = idSchema.safeParse(getStringField(formData, 'id'));
  if (!parsedId.success) {
    return { success: false, error: parsedId.error.issues[0]?.message ?? 'ID không hợp lệ.' };
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { success: false, error: 'Bạn cần đăng nhập để đánh dấu hoàn thành.' };
  }
  if (!can(session.user.role, 'mark:done')) {
    return { success: false, error: 'Bạn không có quyền đánh dấu hoàn thành.' };
  }

  const db = await getDb();
  const deadline = db.deadlines.find((item) => item.id === parsedId.data);
  if (!deadline) {
    return { success: false, error: 'Không tìm thấy deadline.' };
  }

  const completed = !deadline.completedBy.includes(email);
  deadline.completedBy = completed
    ? [...deadline.completedBy, email]
    : deadline.completedBy.filter((completedEmail) => completedEmail !== email);

  await saveDb(db);
  revalidatePath('/deadlines');
  revalidatePath('/dashboard');
  revalidatePath(`/deadlines/${deadline.id}`);

  return {
    success: true,
    completed,
    message: completed ? 'Đã đánh dấu hoàn thành.' : 'Đã bỏ đánh dấu hoàn thành.',
  };
}

export async function createDeadline(formData: FormData): Promise<DeadlineActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Vui lòng đăng nhập trước khi thực hiện.' };
  }
  if (!can(session.user.role, 'create:deadline')) {
    return { success: false, error: 'Bạn không có quyền tạo deadline.' };
  }

  const parsed = createDeadlineSchema.safeParse({
    subjectSlug: getStringField(formData, 'subjectSlug'),
    title: getStringField(formData, 'title'),
    description: getStringField(formData, 'description') ?? '',
    dueDate: getStringField(formData, 'dueDate'),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Dữ liệu deadline không hợp lệ.',
    };
  }

  const db = await getDb();
  if (!db.subjects.some((subject) => subject.slug === parsed.data.subjectSlug)) {
    return { success: false, error: 'Môn học đã chọn không tồn tại.' };
  }

  const nextId = String(
    Math.max(0, ...db.deadlines.map((deadline) => Number.parseInt(deadline.id, 10) || 0)) + 1
  );
  const deadline: Deadline = {
    id: nextId,
    subjectSlug: parsed.data.subjectSlug,
    title: parsed.data.title,
    description: parsed.data.description,
    dueDate: new Date(parsed.data.dueDate).toISOString(),
    completedBy: [],
  };

  db.deadlines.push(deadline);
  await saveDb(db);
  revalidateDeadlinePages(deadline.id, deadline.subjectSlug);
  revalidatePath('/dashboard');

  return { success: true, message: 'Thêm deadline mới thành công.' };
}

export async function deleteDeadline(formData: FormData): Promise<DeadlineActionResult> {
  const parsedId = idSchema.safeParse(getStringField(formData, 'id'));
  if (!parsedId.success) {
    return { success: false, error: parsedId.error.issues[0]?.message ?? 'ID không hợp lệ.' };
  }

  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Vui lòng đăng nhập trước khi thực hiện.' };
  }
  if (!can(session.user.role, 'delete:deadline')) {
    return { success: false, error: 'Bạn không có quyền xoá deadline.' };
  }

  const db = await getDb();
  const deadlineIndex = db.deadlines.findIndex((item) => item.id === parsedId.data);
  if (deadlineIndex < 0) {
    return { success: false, error: 'Deadline không tồn tại hoặc đã bị xoá.' };
  }

  const [removedDeadline] = db.deadlines.splice(deadlineIndex, 1);
  await saveDb(db);
  revalidateDeadlinePages(removedDeadline.id, removedDeadline.subjectSlug);
  revalidatePath('/dashboard');

  return { success: true, message: 'Đã xoá deadline thành công.' };
}
