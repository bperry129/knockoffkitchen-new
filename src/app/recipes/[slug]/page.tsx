import ClientPage from './page.client';

// This function is needed for static site generation with dynamic routes
export async function generateStaticParams() {
  // For static export, we'll return a few placeholder slugs
  // The actual content will be loaded client-side from Firebase
  return [
    { slug: 'homemade-doritos-nacho-cheese' },
    { slug: 'homemade-pringles-original' },
    { slug: 'homemade-oreo-cookies' },
    { slug: 'homemade-heinz-ketchup' },
    { slug: 'homemade-lays-potato-chips' }
  ];
}

// Define the props type for the page component
interface PageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

// This is a server component that exports generateStaticParams
// and renders the client component
export default function RecipeDetailPage(props: PageProps) {
  return <ClientPage {...props} />;
}
