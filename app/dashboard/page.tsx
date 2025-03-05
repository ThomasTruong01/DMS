"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import UploadComponent from "../components/UploadComponent";
import useSWR from "swr";

// A simple fetcher function for SWR.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate initial view using useMemo to ensure consistency.
  const initialView = useMemo(
    () => (searchParams.get("view") === "upload" ? "upload" : "list"),
    [searchParams]
  );
  const [view, setView] = useState<"list" | "upload">(initialView);

  // Always call useSWR, regardless of the view.
  const { data: documents, error } = useSWR("/api/documents", fetcher);

  // Update the URL when view changes.
  useEffect(() => {
    if (view === "upload") {
      router.push("/dashboard?view=upload");
    } else {
      router.push("/dashboard");
    }
  }, [view, router]);

  // Handle authentication.
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // While session is loading, show a loading indicator.
  if (status === "loading") return <div>Loading...</div>;

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
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </header>

        {/* Conditional Rendering based on view state */}
        {view === "list" ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
            {error && <div>Failed to load documents</div>}
            {!documents ? (
              <div>Loading documents...</div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{doc.docName}</p>
                      <p className="text-sm text-gray-600">Revision: {doc.docRev}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <button className="mr-2 text-blue-500">Preview</button>
                      <button className="mr-2 text-green-500">Download</button>
                      <button className="text-red-500">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <UploadComponent onUploadSuccess={() => setView("list")} />
        )}
      </main>
    </div>
  );
}
