// Mock data for recipes
const recipes = {
  'pringles-bbq-chips-copycat': {
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
      '1/4 cup rice flour',
      '1 tsp BBQ seasoning',
      '1/2 tsp salt',
      '1/4 tsp paprika',
      '1/4 tsp garlic powder',
      '1/4 tsp onion powder',
      '2 tbsp vegetable oil',
      '1/2 cup water'
    ],
    instructions: [
      'Mix dry ingredients in a bowl.',
      'Add oil and water, mix until a smooth dough forms.',
      'Roll dough very thin between parchment paper.',
      'Cut into chip shapes.',
      'Bake at 350°F for 10-15 minutes until crispy.',
      'Let cool completely before serving.'
    ]
  },
  'doritos-cool-ranch-copycat': {
    title: 'Copycat Doritos Cool Ranch',
    slug: 'doritos-cool-ranch-copycat',
    image: '/images/recipes/doritos-cool-ranch.jpg',
    description: 'Recreate the classic Cool Ranch Doritos flavor at home.',
    brand: 'Doritos',
    brandSlug: 'doritos',
    category: 'Chips & Crisps',
    categorySlug: 'chips',
    ingredients: [
      '2 cups masa harina (corn flour)',
      '1/2 tsp salt',
      '1 tsp buttermilk powder',
      '1 tsp dried parsley',
      '1/2 tsp garlic powder',
      '1/2 tsp onion powder',
      '1/4 tsp dried dill',
      '1/4 tsp dried chives',
      '1/4 tsp lactic acid powder (or 1 tsp white vinegar)',
      '3/4 cup hot water',
      '2 tbsp vegetable oil'
    ],
    instructions: [
      'Mix all dry ingredients in a bowl.',
      'Add hot water and oil, mix until a dough forms.',
      'Knead for 2 minutes until smooth.',
      'Roll very thin between parchment paper.',
      'Cut into triangles.',
      'Bake at 350°F for 10-12 minutes until crispy.',
      'While still warm, sprinkle with more of the seasoning mix if desired.'
    ]
  },
  'lays-salt-vinegar-chips-copycat': {
    title: 'Copycat Lay\'s Salt & Vinegar Chips',
    slug: 'lays-salt-vinegar-chips-copycat',
    image: '/images/recipes/lays-salt-vinegar.jpg',
    description: 'The perfect tangy and salty homemade potato chips.',
    brand: 'Lay\'s',
    brandSlug: 'lays',
    category: 'Chips & Crisps',
    categorySlug: 'chips',
    ingredients: [
      '4 large russet potatoes',
      '2 cups white vinegar',
      '4 cups water',
      '2 tbsp salt (plus more for sprinkling)',
      'Vegetable oil for frying'
    ],
    instructions: [
      'Slice potatoes very thin (use a mandoline if possible).',
      'Soak potato slices in a mixture of vinegar, water, and salt for 30 minutes.',
      'Drain and pat dry thoroughly.',
      'Heat oil to 350°F.',
      'Fry in batches until golden and crispy, about 3-4 minutes.',
      'Drain on paper towels and immediately sprinkle with salt and a light mist of vinegar.'
    ]
  }
};

// Mock data for brands
const brands = {
  'pringles': {
    name: 'Pringles',
    slug: 'pringles',
    description: 'Pringles is an American brand of stackable potato-based chips. Originally developed by Procter & Gamble in 1967 and marketed as "Pringle\'s Newfangled Potato Chips", the brand was sold to Kellogg\'s in 2012.',
    foundedYear: 1967,
    headquarters: 'Battle Creek, Michigan, USA',
    logo: '/images/brands/pringles-logo.png'
  },
  'doritos': {
    name: 'Doritos',
    slug: 'doritos',
    description: 'Doritos is an American brand of flavored tortilla chips produced since 1964 by Frito-Lay, a wholly owned subsidiary of PepsiCo.',
    foundedYear: 1964,
    headquarters: 'Plano, Texas, USA',
    logo: '/images/brands/doritos-logo.png'
  },
  'lays': {
    name: 'Lay\'s',
    slug: 'lays',
    description: 'Lay\'s is a brand of potato chips, as well as the name of the company that founded the chip brand in the United States. The brand has also sometimes been referred to as Frito-Lay because both Lay\'s and Fritos are brands sold by the Frito-Lay company.',
    foundedYear: 1932,
    headquarters: 'Plano, Texas, USA',
    logo: '/images/brands/lays-logo.png'
  }
};

// Mock data for categories
const categories = {
  'chips': {
    name: 'Chips & Crisps',
    slug: 'chips',
    description: 'Make your favorite store-bought chips and crisps at home with these copycat recipes. Healthier, fresher, and often tastier than the originals!'
  },
  'cookies': {
    name: 'Cookies',
    slug: 'cookies',
    description: 'Recreate famous cookies with our copycat recipes.'
  },
  'sauces': {
    name: 'Sauces & Dips',
    slug: 'sauces',
    description: 'Secret sauce recipes from your favorite restaurants.'
  }
};

// Function to get a recipe by slug
export async function getRecipeBySlug(slug) {
  // In a real app, this would fetch from a database
  return recipes[slug] || null;
}

// Function to get all recipes
export async function getAllRecipes() {
  // In a real app, this would fetch from a database
  return Object.values(recipes);
}

// Function to get recipes by brand
export async function getRecipesByBrand(brandSlug) {
  // In a real app, this would fetch from a database
  return Object.values(recipes).filter(recipe => recipe.brandSlug === brandSlug);
}

// Function to get recipes by category
export async function getRecipesByCategory(categorySlug) {
  // In a real app, this would fetch from a database
  return Object.values(recipes).filter(recipe => recipe.categorySlug === categorySlug);
}

// Function to get a brand by slug
export async function getBrandBySlug(slug) {
  // In a real app, this would fetch from a database
  return brands[slug] || null;
}

// Function to get all brands
export async function getAllBrands() {
  // In a real app, this would fetch from a database
  return Object.values(brands);
}

// Function to get a category by slug
export async function getCategoryBySlug(slug) {
  // In a real app, this would fetch from a database
  return categories[slug] || null;
}

// Function to get all categories
export async function getAllCategories() {
  // In a real app, this would fetch from a database
  return Object.values(categories);
}

// Function to get all recipe slugs (for generateStaticParams)
export async function getAllRecipeSlugs() {
  // In a real app, this would fetch from a database
  return Object.keys(recipes).map(slug => ({ slug }));
}

// Function to get all brand slugs (for generateStaticParams)
export async function getAllBrandSlugs() {
  // In a real app, this would fetch from a database
  return Object.keys(brands).map(slug => ({ slug }));
}

// Function to get all category slugs (for generateStaticParams)
export async function getAllCategorySlugs() {
  // In a real app, this would fetch from a database
  return Object.keys(categories).map(slug => ({ slug }));
}
