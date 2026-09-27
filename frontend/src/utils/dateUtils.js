/**
 * Utility: Định dạng ngày tháng cho các đoạn chat AI Stylist
 * Hiển thị ghi chú ngày bên cạnh tiêu đề đoạn chat để người dùng dễ nhớ.
 */

export function formatChatDate(timestamp, textVi = 'Hôm nay') {
  if (!timestamp) return 'Gần đây';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return 'Gần đây';
  const now = new Date();

  // So sánh cùng ngày
  const isSameDay = d.getDate() === now.getDate() && 
                    d.getMonth() === now.getMonth() && 
                    d.getFullYear() === now.getFullYear();

  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  if (isSameDay) {
    return `${textVi} ${hh}:${mm}`;
  }

  // Hôm qua
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.getDate() === yesterday.getDate() && 
                      d.getMonth() === yesterday.getMonth() && 
                      d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Hôm qua ${hh}:${mm}`;
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  // Nếu cùng năm hiện tại
  if (year === now.getFullYear()) {
    return `${day}/${month}`;
  }

  return `${day}/${month}/${year}`;
}

export function formatChatFullDate(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} - ${day}/${month}/${year}`;
}
