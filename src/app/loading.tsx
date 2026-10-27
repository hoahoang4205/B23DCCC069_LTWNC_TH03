export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div
        className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-label="Đang tải dữ liệu"
      />
      <p className="text-sm text-slate-500 font-medium">Đang tải dữ liệu, vui lòng đợi...</p>
    </div>
  );
}
