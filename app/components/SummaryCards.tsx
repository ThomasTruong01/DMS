import React from "react";

type SummaryCardsProps = {
  totalDocuments: number;
  pendingApprovals: number;
  recentUploads: number;
};

export default function SummaryCards({
  totalDocuments,
  pendingApprovals,
  recentUploads,
}: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Total Documents</h2>
        <p className="text-2xl">{totalDocuments}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Pending Approvals</h2>
        <p className="text-2xl">{pendingApprovals}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Recent Uploads</h2>
        <p className="text-2xl">{recentUploads}</p>
      </div>
    </section>
  );
}
