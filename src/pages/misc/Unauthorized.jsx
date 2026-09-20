import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-display font-bold text-maroon-800 mb-2">403</h1>
      <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
      <Link to="/login" className="btn-primary">Back to Login</Link>
    </div>
  );
}
