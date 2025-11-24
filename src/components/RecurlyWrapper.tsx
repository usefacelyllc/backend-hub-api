'use client';

import React from 'react';
import { RecurlyProvider, Elements } from '@recurly/react-recurly';
import CheckoutForm from './CheckoutForm';

export default function RecurlyWrapper() {
    return (
        <RecurlyProvider publicKey="ewr1-qNQjgvVciHqOmIOyMPlcFK">
            <Elements>
                <CheckoutForm />
            </Elements>
        </RecurlyProvider>
    );
}
