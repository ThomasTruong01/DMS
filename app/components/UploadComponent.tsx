"use client";

import { useState } from "react";

export type UploadComponentProps = {
  onUploadSuccess: () => void;
};

export default function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docRev, setDocRev] = useState("");
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
    formData.append("docName", docName);
    formData.append("docRev", docRev);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful: " + data.fileName);
        // Wait 2 seconds then call the success callback to go back to the dashboard.
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
        {/* Custom label as a button */}
        <label
          htmlFor="fileInput"
          className="cursor-pointer inline-block px-4 py-2 mb-4 border border-gray-300 rounded-md bg-blue-500 text-white"
        >
          Choose File
        </label>
        <br />
        {/* Input for Document Name */}
        <label className="block mb-2">
          Document Name:
          <input
            type="text"
            name="docName"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter document name"
          />
        </label>
        {/* Input for Document Revision */}
        <label className="block mb-4">
          Document Revision:
          <input
            type="text"
            name="docRev"
            value={docRev}
            onChange={(e) => setDocRev(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter document revision"
          />
        </label>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Upload
        </button>
      </form>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
}
