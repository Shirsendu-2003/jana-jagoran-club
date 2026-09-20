import React from 'react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-maroon-600">
      <div className="w-10 h-10 border-4 border-brand-200 border-t-maroon-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
