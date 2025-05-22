import { useState, useEffect } from 'react';
import { listDocuments, uploadDocument, renameDocument, deleteDocument, DocumentFile } from '../api/documents';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchDocuments() {
    setLoading(true);
    setError(null);
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function upload(file: File) {
    setLoading(true);
    setError(null);
    try {
      await uploadDocument(file);
      await fetchDocuments();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function rename(id: string, newName: string) {
    setLoading(true);
    setError(null);
    try {
      await renameDocument(id, newName);
      await fetchDocuments();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setLoading(true);
    setError(null);
    try {
      await deleteDocument(id);
      await fetchDocuments();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    upload,
    rename,
    remove,
    refetch: fetchDocuments,
  };
}
