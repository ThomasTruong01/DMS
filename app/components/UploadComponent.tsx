"use client";

import { useState } from "react";

export type UploadComponentProps = {
  onUploadSuccess: () => void;
};

export default function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful: " + data.fileName);
        setTimeout(() => {
          onUploadSuccess();
        }, 2000);
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Upload failed due to an error.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
      <form onSubmit={handleUpload}>
        {/* Hidden file input */}
        <input
          id="fileInput"
          type="file"
          name="document"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Custom label styled as a button */}
        <label
          htmlFor="fileInput"
          className="cursor-pointer inline-block px-4 py-2 mb-4 border border-gray-300 rounded-md bg-blue-500 text-white"
        >
          Choose File
        </label>
        <br />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Upload
        </button>
      </form>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
}
