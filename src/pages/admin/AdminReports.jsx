import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { reportsApi } from '../../api/endpoints';
import { FileDown } from 'lucide-react';

function downloadBlob(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [loading, setLoading] = useState('');

  const handle = async (key, fn, filename, type) => {
    setLoading(key);
    try {
      const res = await fn();
      downloadBlob(res.data, filename, type);
    } finally {
      setLoading('');
    }
  };

  const reports = [
    {
      key: 'member-pdf',
      title: 'Member Report (PDF)',
      description: 'Full list of members with membership ID, status, and joining date.',
      action: () => handle('member-pdf', reportsApi.memberReportPdf, 'member-report.pdf', 'application/pdf'),
    },
    {
      key: 'member-excel',
      title: 'Member Report (Excel)',
      description: 'Same member data in a spreadsheet, ready for further analysis.',
      action: () => handle('member-excel', reportsApi.memberReportExcel, 'member-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    },
    {
      key: 'payment-excel',
      title: 'Payment Report (Excel)',
      description: 'Complete payment history across all members.',
      action: () => handle('payment-excel', () => reportsApi.paymentReportExcel(), 'payment-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="page-title">Reports</h1>
      <p className="text-gray-500 mb-6">Generate and download reports for club records.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((r) => (
          <div key={r.key} className="card flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-2">{r.title}</h3>
            <p className="text-sm text-gray-500 flex-1 mb-4">{r.description}</p>
            <button onClick={r.action} disabled={loading === r.key} className="btn-primary flex items-center justify-center gap-2">
              <FileDown size={16} /> {loading === r.key ? 'Generating...' : 'Download'}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
