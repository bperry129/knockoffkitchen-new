# KnockoffKitchen - Copycat Recipe Website

## Project Overview

KnockoffKitchen is a website dedicated to providing copycat recipes for popular brand-name foods. The site allows users to browse recipes by category or brand, view detailed recipe instructions, and search for specific recipes.

**Live Site:** [https://knockoffkitchen-new.netlify.app](https://knockoffkitchen-new.netlify.app)  
**GitHub Repository:** [https://github.com/bperry129/knockoffkitchen-new](https://github.com/bperry129/knockoffkitchen-new)

## Technology Stack

- **Framework:** Next.js 14.1.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Netlify (Static Export)
- **SEO:** JSON-LD Schema Markup, OpenGraph tags

## Project Structure

```
knockoffkitchen-new/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx   # Root layout (header, footer, navigation)
│   │   ├── page.tsx     # Homepage
│   │   ├── globals.css  # Global styles
│   │   ├── brand/       # Brand pages
│   │   │   └── [slug]/  # Dynamic brand routes
│   │   ├── category/    # Category pages
│   │   │   └── [slug]/  # Dynamic category routes
│   │   └── recipes/     # Recipe pages
│   │       └── [slug]/  # Dynamic recipe routes
│   │           ├── page.tsx     # Recipe page component
│   │           └── metadata.js  # SEO metadata for recipes
│   └── lib/             # Shared utilities
│       └── api.js       # Mock API functions and data
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── netlify.toml         # Netlify deployment configuration
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Key Features

1. **SEO-Friendly Dynamic Routes**
   - URL structure: `/recipes/[slug]`, `/brand/[slug]`, `/category/[slug]`
   - Each page has proper metadata for search engines
   - Recipe pages include JSON-LD Schema Markup for rich results

2. **Responsive Design**
   - Mobile-first approach with Tailwind CSS
   - Adapts to all screen sizes (mobile, tablet, desktop)
   - Consistent styling throughout the site

3. **Content Organization**
   - Recipes organized by brand and category
   - Featured recipes highlighted on the homepage
   - Clean, readable recipe pages with ingredients and instructions

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bperry129/knockoffkitchen-new.git
   cd knockoffkitchen-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

The site is deployed on Netlify with the following configuration:

- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `out`
- **Branch:** `main` (or `master`)
- **Deploy URL:** [https://knockoffkitchen-new.netlify.app](https://knockoffkitchen-new.netlify.app)

To deploy updates:
1. Push changes to the GitHub repository
2. Netlify will automatically detect changes and trigger a new build
3. The site will be updated once the build completes

## Data Structure

Currently, the site uses mock data stored in `src/lib/api.js`. In a production environment, this would be replaced with a real database or API.

### Recipe Data Structure

```javascript
{
  title: 'Copycat Pringles BBQ Chips',
  slug: 'pringles-bbq-chips-copycat',
  image: '/images/recipes/pringles-bbq.jpg',
  description: 'Make your own BBQ Pringles at home with this copycat recipe.',
  brand: 'Pringles',
  brandSlug: 'pringles',
  category: 'Chips & Crisps',
  categorySlug: 'chips',
  ingredients: [
    '1 cup potato flakes',
    '1/2 cup potato starch',
    // ...more ingredients
  ],
  instructions: [
    'Mix dry ingredients in a bowl.',
    'Add oil and water, mix until a smooth dough forms.',
    // ...more instructions
  ]
}
```

## Future Enhancements

1. **Database Integration**
   - Replace mock data with a real database (MongoDB, PostgreSQL, etc.)
   - Add admin panel for content management

2. **User Features**
   - User accounts and authentication
   - Save favorite recipes
   - Rate and review recipes
   - Submit new copycat recipes

3. **Search Functionality**
   - Implement full-text search
   - Filter recipes by ingredients, difficulty, etc.

4. **Media Enhancements**
   - Add real images for all recipes
   - Include step-by-step photos or videos

## Maintenance

### Regular Tasks

1. **Dependency Updates**
   - Regularly update Next.js and other dependencies
   - Check for security vulnerabilities with `npm audit`

2. **Content Updates**
   - Add new recipes
   - Update existing recipes as needed
   - Ensure all links are working

3. **Performance Monitoring**
   - Monitor site performance using Netlify analytics
   - Check Google Search Console for SEO issues

### Troubleshooting

If you encounter build issues:

1. Check the Netlify build logs for specific errors
2. Ensure all dynamic routes have `generateStaticParams()` functions
3. Verify that the Next.js configuration is correct for static exports
4. Test the build locally with `npm run build`

## Contact Information

For questions or issues related to this project, please contact:

- **Developer:** [Your Name]
- **Email:** [Your Email]
- **GitHub:** [Your GitHub Username]

## License

[Specify the license for the project, e.g., MIT, GPL, etc.]
