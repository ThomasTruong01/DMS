"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import UploadComponent from "../components/UploadComponent";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize view from URL query parameter (default to "list")
  const initialView = searchParams.get("view") === "upload" ? "upload" : "list";
  const [view, setView] = useState<"list" | "upload">(initialView);

  // When view state changes, update the URL.
  useEffect(() => {
    if (view === "upload") {
      router.push("/dashboard?view=upload");
    } else {
      router.push("/dashboard");
    }
  }, [view, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;

  // Dummy document data for the document list.
  const documents = [
    { title: "Document 1", uploadedOn: "2025-03-04" },
    { title: "Document 2", uploadedOn: "2025-03-05" },
    { title: "Document 3", uploadedOn: "2025-03-06" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <button onClick={() => setView("list")} className="text-left w-full">
                Dashboard
              </button>
            </li>
            <li className="mb-2">
              <button onClick={() => setView("upload")} className="text-left w-full">
                Upload Document
              </button>
            </li>
            <li className="mb-2">
              <Link href="/search">Search Documents</Link>
            </li>
            <li className="mb-2">
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img src="/dms-logo.svg" alt="DMS Logo" className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        </header>

        {/* Conditional Rendering based on view state */}
        {view === "list" ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="p-4 bg-white rounded shadow flex justify-between">
                  <div>
                    <p className="font-semibold">{doc.title}</p>
                    <p className="text-sm text-gray-600">Uploaded on {doc.uploadedOn}</p>
                  </div>
                  <div>
                    <button className="mr-2 text-blue-500">Preview</button>
                    <button className="mr-2 text-green-500">Download</button>
                    <button className="text-red-500">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <UploadComponent onUploadSuccess={() => setView("list")} />
        )}
      </main>
    </div>
  );
}
