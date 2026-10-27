import type { Role } from '@/types';

export type Action =
  | 'view:deadline'
  | 'mark:done'
  | 'create:deadline'
  | 'delete:deadline';

export const permissions: Record<Role, readonly Action[]> = {
  guest: ['view:deadline'],
  user: ['view:deadline', 'mark:done'],
  admin: ['view:deadline', 'mark:done', 'create:deadline', 'delete:deadline'],
} as const;

/**
 * Kiểm tra xem vai trò role có quyền thực hiện action hay không.
 * Nếu role là undefined (chưa đăng nhập / khách vãng lai), mặc định role là 'guest'.
 */
export function can(role: Role | undefined | null, action: Action): boolean {
  const effectiveRole: Role = role || 'guest';
  const roleActions = permissions[effectiveRole];
  if (!roleActions) return false;
  return roleActions.includes(action);
}
