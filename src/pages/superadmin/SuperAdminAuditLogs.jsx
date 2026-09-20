import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Loader from '../../components/Loader';
import { superAdminApi } from '../../api/endpoints';

export default function SuperAdminAuditLogs() {
  const [logs, setLogs] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = (p) => {
    setLoading(true);
    superAdminApi.auditLogs(p, 25).then((res) => setLogs(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <DashboardLayout>
      <h1 className="page-title">Audit Logs</h1>
      <p className="text-gray-500 mb-6">System activity trail for accountability and compliance.</p>

      {loading || !logs ? <Loader /> : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4">Timestamp</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Action</th>
                  <th className="py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.content?.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-2 pr-4">{log.user?.name || 'System'}</td>
                    <td className="py-2 pr-4 font-medium text-gray-700">{log.action}</td>
                    <td className="py-2 text-gray-500">{log.details}</td>
                  </tr>
                ))}
                {(!logs.content || logs.content.length === 0) && (
                  <tr><td colSpan="4" className="py-4 text-center text-gray-400">No audit logs recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="btn-secondary text-sm disabled:opacity-40">
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page + 1}</span>
            <button disabled={logs.last} onClick={() => setPage((p) => p + 1)} className="btn-secondary text-sm disabled:opacity-40">
              Next
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
