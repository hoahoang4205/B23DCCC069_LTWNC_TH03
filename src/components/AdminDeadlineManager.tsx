'use client';

import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  message,
  Modal,
  type TableColumnsType,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
} from '@/components/icons';
import type { Dayjs } from 'dayjs';
import type { Deadline, Subject } from '@/types';
import Countdown from '@/components/Countdown';
import { createDeadline, deleteDeadline } from '@/app/actions/deadline';
import { useRouter } from 'next/navigation';

interface DeadlineFormValues {
  subjectSlug: string;
  title: string;
  description?: string;
  dueDate: Dayjs;
}

interface AdminDeadlineManagerProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
}

export default function AdminDeadlineManager({
  initialDeadlines,
  subjects,
}: AdminDeadlineManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<DeadlineFormValues>();
  const router = useRouter();

  const subjectMap = new Map(subjects.map((s) => [s.slug, s.name]));

  const handleCreate = async (values: DeadlineFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('subjectSlug', values.subjectSlug);
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('dueDate', values.dueDate.toISOString());

      const res = await createDeadline(formData);
      if (!res.success) {
        message.error(res.error);
      } else {
        message.success(res.message);
        form.resetFields();
        setIsModalOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const formData = new FormData();
    formData.set('id', id);
    const res = await deleteDeadline(formData);
    if (res.success) {
      message.success(res.message);
      router.refresh();
    } else {
      message.error(res.error);
    }
  };

  const columns: TableColumnsType<Deadline> = [
    {
      title: 'Môn học',
      dataIndex: 'subjectSlug',
      key: 'subjectSlug',
      render: (slug: string) => (
        <Tag color="blue" className="font-medium">
          {subjectMap.get(slug) || slug}
        </Tag>
      ),
      width: 170,
    },
    {
      title: 'Tiêu đề deadline',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Deadline) => (
        <div>
          <div className="font-semibold text-slate-800">{title}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{record.description || 'Chưa có mô tả'}</div>
        </div>
      ),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) => (
        <div>
          <div className="text-xs text-slate-700 font-medium">
            {new Date(dueDate).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="mt-1">
            <Countdown dueDate={dueDate} />
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Đã nộp',
      dataIndex: 'completedBy',
      key: 'completedBy',
      render: (completedBy: string[]) => (
        <Tag color="purple">
          {completedBy.length} SV
        </Tag>
      ),
      width: 90,
      align: 'center' as const,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_value: unknown, record: Deadline) => (
        <Popconfirm
          title="Xoá deadline này?"
          description="Hành động này sẽ cập nhật ngay lập tức dữ liệu và xoá cache ISR."
          onConfirm={() => handleDelete(record.id)}
          okText="Xoá"
          cancelText="Huỷ"
          okButtonProps={{ danger: true }}
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            className="hover:bg-red-50"
          >
            Xoá
          </Button>
        </Popconfirm>
      ),
      width: 100,
      align: 'center' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh Sách Bài Tập ({initialDeadlines.length})</h2>
          <p className="text-xs text-slate-500">Quản lý thêm mới và xoá hạn nộp môn học</p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500"
        >
          Thêm Deadline Mới
        </Button>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={initialDeadlines}
          rowKey="id"
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          className="ant-table-striped"
        />
      </Card>

      {/* Modal Thêm Deadline */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <PlusOutlined className="text-blue-600" />
            <span>Thêm Deadline Mới Cho Lớp</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          className="mt-4"
          requiredMark={false}
        >
          <Form.Item
            name="subjectSlug"
            label={<span className="font-medium text-slate-700">Môn học</span>}
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select
              placeholder="Chọn môn học"
              options={subjects.map((s) => ({ value: s.slug, label: s.name }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="title"
            label={<span className="font-medium text-slate-700">Tiêu đề deadline</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề bài tập!' },
              { min: 3, message: 'Tiêu đề phải từ 3 ký tự trở lên!' },
            ]}
          >
            <Input placeholder="Ví dụ: Bài tập tuần 3 - Tìm hiểu Redux Toolkit" size="large" />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label={<span className="font-medium text-slate-700">Hạn chót nộp bài</span>}
            rules={[{ required: true, message: 'Vui lòng chọn hạn chót!' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Chọn ngày và giờ hạn nộp"
              className="w-full"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-medium text-slate-700">Mô tả & Hướng dẫn (tuỳ chọn)</span>}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nội dung tóm tắt yêu cầu của bài tập..."
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Huỷ</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600"
            >
              Lưu & Công Bố
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
