import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The recipe you're looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
          <div className="pt-4">
            <p className="text-gray-500 mb-2">Or check out these popular sections:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/category/chips"
                className="text-blue-600 hover:underline"
              >
                Chips & Crisps
              </Link>
              <Link 
                href="/brand/pringles"
                className="text-blue-600 hover:underline"
              >
                Pringles Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
  };
}
