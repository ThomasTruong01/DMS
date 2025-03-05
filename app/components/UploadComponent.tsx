"use client";

import { useState, useEffect } from "react";

export type UploadComponentProps = {
  onUploadSuccess: () => void;
};

export default function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docNum, setDocNum] = useState("");
  const [docType, setDocType] = useState<"new" | "update">("new");
  const [docName, setDocName] = useState("");
  const [docRev, setDocRev] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [validationError, setValidationError] = useState("");

  // When "update" is selected and docNum changes, validate if the document exists.
  useEffect(() => {
    if (docType === "update" && docNum.trim()) {
      // Call the validation API endpoint.
      fetch(`/api/documents/validate?docNum=${encodeURIComponent(docNum)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.exists) {
            // If the document exists, auto-fill the document name and revision.
            setDocName(data.docName);
            setDocRev(data.docRev);
            setValidationError("");
          } else {
            // If it doesn't exist, clear any prefilled values and set an error.
            setDocName("");
            setDocRev("");
            setValidationError("Document number does not exist.");
          }
        })
        .catch((error) => {
          console.error("Validation error:", error);
          setValidationError("Error validating document number.");
          setDocName("");
          setDocRev("");
        });
    }
  }, [docNum, docType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that all fields are filled.
    if (!docNum.trim() || !docName.trim() || !docRev.trim() || !file) {
      setUploadStatus("All fields are required.");
      return;
    }
    // For updates, ensure the document exists.
    if (docType === "update" && validationError) {
      setUploadStatus("Cannot update: " + validationError);
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("docNum", docNum);
    formData.append("docName", docName);
    formData.append("docRev", docRev);
    formData.append("docType", docType);

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
        {/* Document Number */}
        <label className="block mb-2">
          Document Number:
          <input
            type="text"
            name="docNum"
            value={docNum}
            onChange={(e) => setDocNum(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter document number"
            required
          />
        </label>
        {/* Document Type: New or Update */}
        <div className="mb-4">
          <span className="mr-4">Document Type:</span>
          <label className="mr-4">
            <input
              type="radio"
              name="docType"
              value="new"
              checked={docType === "new"}
              onChange={() => {
                setDocType("new");
                setValidationError("");
                // Clear prefilled fields when switching to new.
                setDocName("");
                setDocRev("");
              }}
            />{" "}
            New
          </label>
          <label>
            <input
              type="radio"
              name="docType"
              value="update"
              checked={docType === "update"}
              onChange={() => setDocType("update")}
            />{" "}
            Update
          </label>
        </div>
        {/* Document Name */}
        <label className="block mb-2">
          Document Name:
          <input
            type="text"
            name="docName"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter document name"
            required
          />
        </label>
        {/* Document Revision */}
        <label className="block mb-2">
          Document Revision:
          <input
            type="text"
            name="docRev"
            value={docRev}
            onChange={(e) => setDocRev(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter document revision"
            required
          />
        </label>
        {/* File Input with custom button */}
        <input
          id="fileInput"
          type="file"
          name="document"
          onChange={handleFileChange}
          className="hidden"
          required
        />
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
      {validationError && <p className="mt-4 text-red-500">{validationError}</p>}
    </div>
  );
}
