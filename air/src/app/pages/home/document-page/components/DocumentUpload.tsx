import React, { useRef } from 'react';

interface UploadFileProps {
  onUpload: (file: File) => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} ref={fileInputRef} />
    </div>
  );
};
