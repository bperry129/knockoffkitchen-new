import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
        
        <div className="p-6">
          <section className="mb-8">
            <p className="text-gray-600 mb-4">
              Last Updated: March 15, 2025
            </p>
            
            <p className="text-gray-700 mb-6">
              At KnockoffKitchen, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website.
            </p>
            
            <p className="text-gray-700 mb-6">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
              please do not access the site.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
            
            <p className="text-gray-700 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Register on our website</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in contests or surveys</li>
              <li>Contact us through our contact form</li>
              <li>Post comments or feedback</li>
            </ul>
            
            <p className="text-gray-700 mb-4">
              The personal information we may collect includes:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Mailing address</li>
              <li>Phone number</li>
              <li>User-generated content (such as comments and recipe ratings)</li>
            </ul>
            
            <p className="text-gray-700 mb-4">
              We also automatically collect certain information when you visit our website, including:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on those pages</li>
              <li>Referring website</li>
              <li>Device information</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
            
            <p className="text-gray-700 mb-4">
              We may use the information we collect for various purposes, including to:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our website</li>
              <li>Process and respond to your inquiries</li>
              <li>Send you newsletters, updates, and marketing communications</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
              <li>Comply with our legal obligations</li>
              <li>Enforce our Terms of Service</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. Cookies and Tracking Technologies</h2>
            
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            
            <p className="text-gray-700 mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
            
            <p className="text-gray-700 mb-4">
              We use the following types of cookies:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Essential cookies:</strong> Necessary for the website to function properly.</li>
              <li><strong>Preference cookies:</strong> Enable the website to remember your preferences.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website.</li>
              <li><strong>Marketing cookies:</strong> Used to track visitors across websites to display relevant advertisements.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. Third-Party Services</h2>
            
            <p className="text-gray-700 mb-4">
              We may use third-party service providers to help us operate our website, such as:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Google Analytics (for website analytics)</li>
              <li>Mailchimp (for email newsletters)</li>
              <li>Disqus (for comments)</li>
              <li>Social media platforms (for sharing content)</li>
            </ul>
            
            <p className="text-gray-700 mb-4">
              These third parties may have access to your personal information only to perform these tasks on our behalf 
              and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. Data Security</h2>
            
            <p className="text-gray-700 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security 
              of any personal information we process. However, please also remember that we cannot guarantee that the internet 
              itself is 100% secure.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Your Data Protection Rights</h2>
            
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the following data protection rights:
            </p>
            
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>The right to access, update, or delete your personal information</li>
              <li>The right to rectification (to correct or update your personal information)</li>
              <li>The right to object (to the processing of your personal information)</li>
              <li>The right of restriction (to request that we restrict the processing of your personal information)</li>
              <li>The right to data portability (to receive a copy of your personal information in a structured, machine-readable format)</li>
              <li>The right to withdraw consent (where we rely on your consent to process your personal information)</li>
            </ul>
            
            <p className="text-gray-700 mb-4">
              To exercise any of these rights, please contact us at info@knockoffkitchen.com.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. Children's Privacy</h2>
            
            <p className="text-gray-700 mb-4">
              Our website is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and you are aware that your child has provided us with 
              personal information, please contact us.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. Changes to This Privacy Policy</h2>
            
            <p className="text-gray-700 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            
            <p className="text-gray-700 mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
              are effective when they are posted on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">9. Contact Us</h2>
            
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy, please contact us at info@knockoffkitchen.com.
            </p>
            
            <div className="mt-8">
              <Link 
                href="/terms"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View our Terms of Service
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
    title: 'Privacy Policy',
    description: 'Privacy Policy for KnockoffKitchen. Learn how we collect, use, and protect your personal information.',
  };
}
