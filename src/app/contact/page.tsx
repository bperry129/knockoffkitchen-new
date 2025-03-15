"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your backend
    // For now, we'll just simulate a successful submission
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1000);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        </div>
        
        <div className="p-6">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Get in Touch</h2>
            
            <div className="prose max-w-none mb-8">
              <p className="mb-4">
                Have a question, suggestion, or just want to say hello? We'd love to hear from you! 
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {formStatus.submitted ? (
                  <div className={`p-4 rounded-md ${formStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-medium">{formStatus.message}</p>
                    {formStatus.success && (
                      <button 
                        onClick={() => setFormStatus(prev => ({ ...prev, submitted: false }))}
                        className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Send another message
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a subject</option>
                        <option value="Recipe Request">Recipe Request</option>
                        <option value="Recipe Feedback">Recipe Feedback</option>
                        <option value="Website Feedback">Website Feedback</option>
                        <option value="Business Inquiry">Business Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-3">
                        <i className="fas fa-envelope text-indigo-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-gray-600">info@knockoffkitchen.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-3">
                        <i className="fas fa-phone text-indigo-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-gray-600">(123) 456-7890</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-3">
                        <i className="fas fa-map-marker-alt text-indigo-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-gray-600">New York, NY</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                    
                    <div className="flex space-x-4">
                      <a href="#" className="bg-indigo-100 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                        <i className="fab fa-facebook-f text-indigo-600"></i>
                      </a>
                      <a href="#" className="bg-indigo-100 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                        <i className="fab fa-twitter text-indigo-600"></i>
                      </a>
                      <a href="#" className="bg-indigo-100 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                        <i className="fab fa-instagram text-indigo-600"></i>
                      </a>
                      <a href="#" className="bg-indigo-100 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                        <i className="fab fa-pinterest text-indigo-600"></i>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Recipe Request</h3>
                  <p className="text-gray-700 mb-4">
                    Is there a specific brand-name product you'd like us to create a copycat recipe for? 
                    Let us know! We prioritize our recipe development based on user requests.
                  </p>
                  <p className="text-gray-700">
                    Please include as much detail as possible about the product, including the brand, 
                    product name, and what you love about it.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3">
                  <h4 className="text-md font-medium text-gray-900">How long does it take to get a response?</h4>
                </div>
                <div className="px-4 py-3">
                  <p className="text-gray-700">We typically respond to inquiries within 1-2 business days.</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3">
                  <h4 className="text-md font-medium text-gray-900">Can I request a specific recipe?</h4>
                </div>
                <div className="px-4 py-3">
                  <p className="text-gray-700">Absolutely! We love hearing what recipes our community wants to see. While we can't guarantee we'll create every requested recipe, we do prioritize our development based on user requests.</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3">
                  <h4 className="text-md font-medium text-gray-900">Do you offer sponsorships or collaborations?</h4>
                </div>
                <div className="px-4 py-3">
                  <p className="text-gray-700">Yes, we're open to partnerships with brands and creators that align with our values. Please select "Business Inquiry" in the contact form for these requests.</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3">
                  <h4 className="text-md font-medium text-gray-900">Can I share my own copycat recipe?</h4>
                </div>
                <div className="px-4 py-3">
                  <p className="text-gray-700">We love seeing what our community creates! While we currently don't have a public submission system, you can email us your recipe and we may feature it (with credit to you, of course).</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'Contact Us',
    description: 'Get in touch with the KnockoffKitchen team. Ask questions, request recipes, or share your feedback.',
  };
}
