'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContactPreference } from '@/types';

export default function ContactPage() {
  const router = useRouter();
  const [contactPreference, setContactPreference] = useState<ContactPreference>('ANONYMOUS');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    const contactData = {
      preference: contactPreference,
      name: contactPreference !== 'ANONYMOUS' ? name : undefined,
      phone: ['PHONE', 'ALL'].includes(contactPreference) ? phone : undefined,
      email: ['EMAIL', 'ALL'].includes(contactPreference) ? email : undefined,
    };

    sessionStorage.setItem('report_contact', JSON.stringify(contactData));
    router.push('/report/confirm');
  };

  const isValid = () => {
    if (contactPreference === 'ANONYMOUS') return true;
    if (contactPreference === 'NAME_ONLY') return name.trim() !== '';
    if (contactPreference === 'PHONE') return name.trim() !== '' && phone.trim() !== '';
    if (contactPreference === 'EMAIL') return name.trim() !== '' && email.trim() !== '';
    if (contactPreference === 'ALL') {
      return name.trim() !== '' && phone.trim() !== '' && email.trim() !== '';
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h1>
          <p className="text-gray-600">
            Choose how much information you want to share (optional)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I would like to:
            </label>
            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="preference"
                  value="ANONYMOUS"
                  checked={contactPreference === 'ANONYMOUS'}
                  onChange={(e) => setContactPreference(e.target.value as ContactPreference)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Remain Anonymous</div>
                  <div className="text-sm text-gray-600">No contact information shared</div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="preference"
                  value="NAME_ONLY"
                  checked={contactPreference === 'NAME_ONLY'}
                  onChange={(e) => setContactPreference(e.target.value as ContactPreference)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Share Name Only</div>
                  <div className="text-sm text-gray-600">Just your name, no contact details</div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <input
                  type="radio"
                  name="preference"
                  value="ALL"
                  checked={contactPreference === 'ALL'}
                  onChange={(e) => setContactPreference(e.target.value as ContactPreference)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Share Full Contact Details</div>
                  <div className="text-sm text-gray-600">
                    Name, phone, and email (for updates)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {contactPreference !== 'ANONYMOUS' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              {['PHONE', 'ALL'].includes(contactPreference) && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              )}

              {['EMAIL', 'ALL'].includes(contactPreference) && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!isValid()}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            Review Report
          </button>
        </div>
      </div>
    </div>
  );
}
