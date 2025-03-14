import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
        Return to Home
      </Link>
    </div>
  );
}
