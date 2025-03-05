"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import UploadComponent from "../components/UploadComponent";
import DocumentList, { Document } from "../components/DocumentList";
import SummaryCards from "../components/SummaryCards";
import useSWR from "swr";

// A simple fetcher function for SWR.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams || new URLSearchParams();

  // Determine initial view from URL query parameter
  const initialView = useMemo(
    () => (searchParams.get("view") === "upload" ? "upload" : "list"),
    [searchParams]
  );
  const [view, setView] = useState<"list" | "upload">(initialView);

  // Fetch documents using SWR.
  const { data: documents, error, mutate } = useSWR<Document[]>("/api/documents", fetcher);

  // Update URL when view state changes.
  useEffect(() => {
    if (view === "upload") {
      router.push("/dashboard?view=upload");
    } else {
      router.push("/dashboard");
    }
  }, [view, router]);

  // Ensure user is signed in.
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;

  // Calculate summary values.
  const totalDocuments = documents ? documents.length : 0;
  // For demo purposes, pendingApprovals is hard-coded; update as needed.
  const pendingApprovals = 5;
  // For recent uploads, show the count of recent documents (for example, up to 3).
  const recentUploads = documents ? Math.min(3, documents.length) : 0;

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
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img src="/dms-logo.svg" alt="DMS Logo" className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </header>

        {/* Summary Cards Component */}
        <SummaryCards
          totalDocuments={totalDocuments}
          pendingApprovals={pendingApprovals}
          recentUploads={recentUploads}
        />

        {/* Conditional Rendering: Document List or Upload Component */}
        {view === "list" ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
            {error && <div>Failed to load documents</div>}
            {!documents ? (
              <div>Loading documents...</div>
            ) : (
              <DocumentList documents={documents} mutate={mutate} />
            )}
          </section>
        ) : (
          <UploadComponent onUploadSuccess={() => { setView("list"); mutate(); }} />
        )}
      </main>
    </div>
  );
}
