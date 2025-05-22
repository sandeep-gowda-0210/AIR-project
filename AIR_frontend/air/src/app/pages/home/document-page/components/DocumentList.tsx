import React, { useState } from 'react';
import { DocumentFile } from '../api/documents';

interface DocumentListProps {
  documents: DocumentFile[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onRename, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  function startRename(doc: DocumentFile) {
    setEditingId(doc.id);
    setNewName(doc.name);
  }

  function submitRename() {
    if (editingId && newName.trim() !== '') {
      onRename(editingId, newName.trim());
      setEditingId(null);
      setNewName('');
    }
  }

  return (
    <div>
      <h2>Your Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {editingId === doc.id ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={submitRename}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{doc.name} ({doc.type})</span>
                <button onClick={() => startRename(doc)}>Rename</button>
                <button onClick={() => onDelete(doc.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
