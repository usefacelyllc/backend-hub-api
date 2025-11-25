'use client';

import React from 'react';
import { RecurlyProvider, Elements } from '@recurly/react-recurly';
import CheckoutForm from './CheckoutForm';

export default function RecurlyWrapper() {
    return (
        <RecurlyProvider publicKey="ewr1-51YSZZAboXiIyzSYrp9zL0">
            <Elements>
                <CheckoutForm />
            </Elements>
        </RecurlyProvider>
    );
}
