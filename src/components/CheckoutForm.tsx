'use client';

import React, { useState } from 'react';
import {
    CardNumberElement,
    CardMonthElement,
    CardYearElement,
    CardCvvElement,
    useRecurly,
} from '@recurly/react-recurly';

export default function CheckoutForm() {
    const recurly = useRecurly();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);

    // Pre-filled form data for easy testing
    const [formData, setFormData] = useState({
        firstName: 'Jefferson',
        lastName: 'Rodriguez',
        customerEmail: 'qa.qa@example.com',
        address1: 'Travessa Margaridas',
        city: 'Salvador',
        postal_code: '40301-110',
        country: 'BR',
        trialAmount: '5.00',
        trialDays: '7',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if Recurly is ready
        if (!recurly) {
            setResponse({
                error: 'Recurly not initialized',
                details: 'Please wait for the payment form to load',
            });
            return;
        }

        setLoading(true);
        setResponse(null);

        // Create a form element with all the data for Recurly.js
        const form = e.target as HTMLFormElement;

        // Use recurly.token with the form element (Elements will auto-capture card data)
        recurly.token(form, async (err: any, token: any) => {
            if (err) {
                setResponse({
                    error: 'Token generation failed',
                    details: err.message || 'Please check your card details',
                    code: err.code,
                    fields: err.fields || [],
                });
                setLoading(false);
                return;
            }

            try {
                // Send token to backend
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tokenId: token.id,
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerEmail: formData.customerEmail,
                        trialAmount: parseFloat(formData.trialAmount),
                        trialDays: parseInt(formData.trialDays),
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setResponse({
                        error: data.error || 'Checkout failed',
                        details: data.details,
                        hint: data.hint,
                        fullResponse: data,
                    });
                } else {
                    setResponse({
                        success: true,
                        message: '✅ Purchase successful!',
                        data: data,
                    });
                }
            } catch (err: any) {
                setResponse({
                    error: 'Checkout request failed',
                    details: err.message || err,
                });
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Recurly Checkout</h1>
                    <p className="text-gray-600">Hybrid Purchase - Subscription with Paid Trial</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                Customer Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        data-recurly="first_name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        data-recurly="last_name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                                Billing Address
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address1"
                                        data-recurly="address1"
                                        value={formData.address1}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            data-recurly="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            data-recurly="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select
                                        name="country"
                                        data-recurly="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="US">United States</option>
                                        <option value="BR">Brazil</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Card Details */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                                Payment Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                    <div className="border border-gray-300 rounded-lg p-3 bg-white hover:border-indigo-400 transition-colors">
                                        <CardNumberElement
                                            style={{
                                                fontSize: '16px',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                placeholder: {
                                                    color: '#9CA3AF',
                                                    content: '4111 1111 1111 1111'
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">💳 Test: 4111 1111 1111 1111</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                        <div className="border border-gray-300 rounded-lg p-3 bg-white hover:border-indigo-400 transition-colors">
                                            <CardMonthElement
                                                style={{
                                                    fontSize: '16px',
                                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                        <div className="border border-gray-300 rounded-lg p-3 bg-white hover:border-indigo-400 transition-colors">
                                            <CardYearElement
                                                style={{
                                                    fontSize: '16px',
                                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                        <div className="border border-gray-300 rounded-lg p-3 bg-white hover:border-indigo-400 transition-colors">
                                            <CardCvvElement
                                                style={{
                                                    fontSize: '16px',
                                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trial Configuration */}
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-indigo-900 mb-3">Trial Configuration</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trial Amount ($)</label>
                                    <input
                                        type="number"
                                        name="trialAmount"
                                        value={formData.trialAmount}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
                                    <input
                                        type="number"
                                        name="trialDays"
                                        value={formData.trialDays}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                '🚀 Subscribe Now'
                            )}
                        </button>
                    </form>

                    {/* Response Display */}
                    {response && (
                        <div className={`mt-6 p-4 rounded-lg ${response.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {response.success ? (
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className={`text-sm font-semibold ${response.success ? 'text-green-800' : 'text-red-800'}`}>
                                        {response.success ? 'Success!' : 'Error'}
                                    </h3>
                                    <div className={`mt-2 text-sm ${response.success ? 'text-green-700' : 'text-red-700'}`}>
                                        {response.message || response.error}
                                        {response.details && (
                                            <p className="mt-1 text-xs opacity-75">{JSON.stringify(response.details)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>🔒 Secure payment powered by Recurly</p>
                    <p className="mt-1">Test Mode - Use card: 4111 1111 1111 1111</p>
                </div>
            </div>
        </div>
    );
}
