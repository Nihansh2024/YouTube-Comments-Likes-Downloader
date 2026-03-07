import * as XLSX from 'xlsx';

export interface CommentData {
  username: string;
  comment: string;
  likes: number;
  date: string;
}

export function generateCSV(comments: CommentData[]): string {
  const headers = ['Username', 'Comment', 'Likes', 'Date'];
  const rows = comments.map(c => [
    escapeCSV(c.username),
    escapeCSV(c.comment),
    c.likes.toString(),
    c.date,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateExcel(comments: CommentData[]): Buffer {
  const workbook = XLSX.utils.book_new();
  
  const worksheetData = [
    ['Username', 'Comment', 'Likes', 'Date'],
    ...comments.map(c => [c.username, c.comment, c.likes, c.date]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // Username
    { wch: 80 }, // Comment
    { wch: 10 }, // Likes
    { wch: 20 }, // Date
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Comments');
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(buffer);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
