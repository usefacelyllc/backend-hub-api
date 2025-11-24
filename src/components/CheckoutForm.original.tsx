'use client';

import React, { useState } from 'react';
import {
    CardElement,
    useRecurly,
    Elements,
} from '@recurly/react-recurly';

export default function CheckoutForm() {
    const recurly = useRecurly();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        trialAmount: '5.00',
        trialDays: '7',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        const form = document.querySelector('form') as HTMLFormElement;
        recurly.token(form, async (err: any, token: any) => {
            if (err) {
                setResponse({ error: err.message || 'Token generation failed' });
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tokenId: token.id,
                        customerName: formData.customerName,
                        customerEmail: formData.customerEmail,
                        trialAmount: parseFloat(formData.trialAmount),
                        trialDays: parseInt(formData.trialDays),
                        metadata: {
                            ip: '127.0.0.1',
                        },
                    }),
                });

                const data = await res.json();
                setResponse(data);
            } catch (fetchErr: any) {
                setResponse({ error: fetchErr.message || 'An error occurred' });
            } finally {
                setLoading(false);
            }
        });
    };

    const handleUpsell = async () => {
        setLoading(true);
        setResponse(null);
        try {
            const res = await fetch('/api/upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerEmail: formData.customerEmail,
                    itemCode: 'dressfy-paid-trial',
                    amount: 10.00
                })
            });
            const data = await res.json();
            setResponse(data);
        } catch (err: any) {
            setResponse({ error: err.message || 'An error occurred during upsell' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Trial Amount ($)</label>
                        <input
                            type="number"
                            name="trialAmount"
                            value={formData.trialAmount}
                            onChange={handleChange}
                            step="0.01"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Trial Days</label>
                        <input
                            type="number"
                            name="trialDays"
                            value={formData.trialDays}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                <div className="border p-3 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                    <CardElement />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Subscribe'}
                </button>
            </form>

            <div className="mt-4 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Upsell Test</h3>
                <button
                    type="button"
                    onClick={handleUpsell}
                    disabled={loading || !formData.customerEmail}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    Buy One-Click Upsell ($10)
                </button>
                <p className="text-xs text-gray-500 mt-1">Requires existing account with email above.</p>
            </div>

            {response && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md overflow-auto max-h-60">
                    <h3 className="text-sm font-medium text-gray-900">Response:</h3>
                    <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
