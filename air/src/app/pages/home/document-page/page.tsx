'use client';

import React from 'react';
import { useDocuments } from './hooks/useSupabaseDocClient';
import { DocumentList } from './components/DocumentList';
import { UploadFile } from './components/DocumentUpload';

export default function DocumentsPage() {
  const { documents, loading, error, upload, rename, remove } = useDocuments();

  return (
    <div className="p-4">
      <h1>Document Storage</h1>

      <UploadFile onUpload={upload} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <DocumentList
        documents={documents}
        onRename={rename}
        onDelete={remove}
      />
    </div>
  );
}
