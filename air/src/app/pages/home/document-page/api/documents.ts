// /documents/api/documents.ts
export interface DocumentFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function listDocuments(): Promise<DocumentFile[]> {
  const res = await fetch(`${BASE_URL}/api/documents/list-root`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function uploadDocument(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Upload failed');
}

export async function createFolder(folderName: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/documents/create-folder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ folderName }),
  });
  if (!res.ok) throw new Error('Create folder failed');
}

export async function renameDocument(id: string, newName: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/documents/rename/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error('Rename failed');
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/documents/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Delete failed');
}

export async function previewDocument(id: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/documents/preview/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Preview failed');
  return res.blob();
}
