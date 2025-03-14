import { getRecipeBySlug } from '@/lib/api';

export async function generateMetadata({ params }) {
    const recipe = await getRecipeBySlug(params.slug);

    if (!recipe) {
        return {
            title: 'Recipe Not Found - Copycat Recipes',
            description: 'This recipe does not exist.',
        };
    }

    return {
        title: `${recipe.title} - Copycat Recipe`,
        description: recipe.description,
        openGraph: {
            title: `${recipe.title} - Copycat Recipe`,
            description: recipe.description,
            url: `https://knockoffkitchen-new.netlify.app/recipes/${params.slug}`,
            images: [
                {
                    url: recipe.image,
                    width: 600,
                    height: 400,
                },
            ],
        },
    };
}
