"use client";
import { useState } from "react";

export type Document = {
  id: number;
  docID: string;
  docNum: string;
  docName: string;
  docRev: string;
  fileUrl: string;
  uploadedAt: string;
};

type DocumentListProps = {
  documents: Document[];
  mutate: () => void;
};

export default function DocumentList({ documents, mutate }: DocumentListProps) {
  // Preview: open the file URL in a new tab
  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  // Download: create an anchor element with the download attribute and click it
  const handleDownload = (fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    // Extract the filename from the URL
    link.download = fileUrl.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete: call an API endpoint to delete the document, then refresh the list
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Refresh the SWR cache (or re-fetch the document list)
        mutate();
      } else {
        alert("Failed to delete document.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Error deleting document.");
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-4 bg-white rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{doc.docNum} - {doc.docName}</p>
            <p className="text-sm text-gray-600">Revision: {doc.docRev}</p>
            <p className="text-sm text-gray-500">
              Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <button
              onClick={() => handlePreview(doc.fileUrl)}
              className="mr-2 text-blue-500"
            >
              Preview
            </button>
            <button
              onClick={() => handleDownload(doc.fileUrl)}
              className="mr-2 text-green-500"
            >
              Download
            </button>
            <button onClick={() => handleDelete(doc.id)} className="text-red-500">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
