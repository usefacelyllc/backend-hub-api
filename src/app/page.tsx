'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const RecurlyWrapper = dynamic(
  () => import('@/components/RecurlyWrapper'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Backend Hub API
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Recurly Payment Integration Test
          </p>
        </div>

        <RecurlyWrapper />
      </div>
    </main>
  );
}
