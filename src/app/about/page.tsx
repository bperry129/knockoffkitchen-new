import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">About KnockoffKitchen</h1>
        </div>
        
        <div className="p-6">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Our Story</h2>
            
            <div className="prose max-w-none mb-8">
              <p className="mb-4">
                KnockoffKitchen was born from a simple idea: what if we could recreate our favorite brand-name foods at home, 
                with better ingredients, less cost, and more fun? Our founder, a passionate home cook, started experimenting 
                with copycat recipes after becoming frustrated with the high prices and questionable ingredients in many 
                store-bought products.
              </p>
              
              <p className="mb-4">
                What began as a personal blog quickly grew into a community of like-minded food enthusiasts who shared 
                the same passion for recreating popular foods at home. Today, KnockoffKitchen is a comprehensive resource 
                for anyone looking to make their favorite brand-name products in their own kitchen.
              </p>
              
              <div className="my-8 bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-500">
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="italic text-gray-700">
                  "To empower home cooks to recreate their favorite brand-name foods with better ingredients, 
                  less cost, and more satisfaction than the originals."
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">What We Offer</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <i className="fas fa-flask text-indigo-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold">Tested Recipes</h3>
                </div>
                <p className="text-gray-700">
                  Every recipe on KnockoffKitchen is meticulously tested to ensure it closely matches the flavor, 
                  texture, and appearance of the original product. We don't publish a recipe until we're confident 
                  it's a worthy alternative to the store-bought version.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <i className="fas fa-leaf text-indigo-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold">Better Ingredients</h3>
                </div>
                <p className="text-gray-700">
                  Our recipes focus on using whole, natural ingredients whenever possible. We help you avoid 
                  artificial preservatives, colors, and flavors that are common in many commercial products.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <i className="fas fa-dollar-sign text-indigo-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold">Cost Savings</h3>
                </div>
                <p className="text-gray-700">
                  Making your favorite foods at home is often more economical than buying them pre-made. 
                  We provide cost comparisons to show you just how much you can save with our recipes.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <i className="fas fa-users text-indigo-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold">Community</h3>
                </div>
                <p className="text-gray-700">
                  KnockoffKitchen is more than just a recipe website—it's a community of food enthusiasts who 
                  share tips, variations, and success stories. We learn from each other and continuously improve 
                  our recipes based on community feedback.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Our Process</h2>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Research</h3>
                  <p className="text-gray-700">
                    We start by thoroughly researching the original product, studying its ingredients, 
                    flavor profile, texture, and appearance. We also gather information from public sources 
                    about manufacturing processes and techniques.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Development</h3>
                  <p className="text-gray-700">
                    Our recipe developers create multiple test versions, refining the ingredients and 
                    techniques until we achieve a result that closely resembles the original product.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Testing</h3>
                  <p className="text-gray-700">
                    Each recipe undergoes multiple rounds of testing to ensure consistency and quality. 
                    We often conduct blind taste tests comparing our version to the original.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Publication</h3>
                  <p className="text-gray-700">
                    Once we're satisfied with the recipe, we create detailed instructions, take high-quality 
                    photos, and publish it on our website with nutritional information, cost comparisons, 
                    and helpful tips.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mr-4">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Refinement</h3>
                  <p className="text-gray-700">
                    We continuously update our recipes based on user feedback and new information. 
                    Our goal is to make each recipe better over time.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Join Our Community</h2>
            
            <p className="text-gray-700 mb-6">
              We invite you to join our community of home cooks who are passionate about recreating their 
              favorite foods at home. Share your successes, ask questions, and connect with like-minded food enthusiasts.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Link 
                href="/contact"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors text-center"
              >
                Contact Us
              </Link>
              
              <Link 
                href="/recipes"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors text-center"
              >
                Explore Our Recipes
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'About Us',
    description: 'Learn about KnockoffKitchen, our mission, and how we create the best copycat recipes for your favorite brand-name foods.',
  };
}
