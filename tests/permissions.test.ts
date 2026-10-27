import { can } from '@/lib/permissions';

describe('Kiểm thử ma trận phân quyền can(role, action)', () => {
  describe('Vai trò Khách (guest hoặc undefined/null)', () => {
    it('Khách có thể xem deadline', () => {
      expect(can('guest', 'view:deadline')).toBe(true);
      expect(can(undefined, 'view:deadline')).toBe(true);
      expect(can(null, 'view:deadline')).toBe(true);
    });

    it('Khách KHÔNG THỂ đánh dấu đã xong', () => {
      expect(can('guest', 'mark:done')).toBe(false);
      expect(can(undefined, 'mark:done')).toBe(false);
      expect(can(null, 'mark:done')).toBe(false);
    });

    it('Khách KHÔNG THỂ tạo deadline', () => {
      expect(can('guest', 'create:deadline')).toBe(false);
      expect(can(undefined, 'create:deadline')).toBe(false);
    });

    it('Khách KHÔNG THỂ xoá deadline', () => {
      expect(can('guest', 'delete:deadline')).toBe(false);
      expect(can(undefined, 'delete:deadline')).toBe(false);
    });
  });

  describe('Vai trò Sinh viên (user)', () => {
    it('Sinh viên có thể xem deadline', () => {
      expect(can('user', 'view:deadline')).toBe(true);
    });

    it('Sinh viên có thể đánh dấu đã xong deadline', () => {
      expect(can('user', 'mark:done')).toBe(true);
    });

    it('Sinh viên KHÔNG THỂ tạo deadline mới', () => {
      expect(can('user', 'create:deadline')).toBe(false);
    });

    it('Sinh viên KHÔNG THỂ xoá deadline', () => {
      expect(can('user', 'delete:deadline')).toBe(false);
    });
  });

  describe('Vai trò Lớp trưởng / Admin (admin)', () => {
    it('Admin có toàn quyền: xem deadline', () => {
      expect(can('admin', 'view:deadline')).toBe(true);
    });

    it('Admin có thể đánh dấu hoàn thành', () => {
      expect(can('admin', 'mark:done')).toBe(true);
    });

    it('Admin có thể tạo deadline mới', () => {
      expect(can('admin', 'create:deadline')).toBe(true);
    });

    it('Admin có thể xoá deadline', () => {
      expect(can('admin', 'delete:deadline')).toBe(true);
    });
  });
});
