import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-5xl font-black text-white tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mt-2">Resource Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-2">
        The task, endpoint, or page you requested does not exist or has been relocated.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
