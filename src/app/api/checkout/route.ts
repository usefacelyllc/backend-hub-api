import { NextResponse } from 'next/server';
import { client } from '../../../lib/recurly';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tokenId, customerEmail, customerName, trialAmount, trialDays, metadata } = body;

        if (!tokenId || !customerEmail || !customerName) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: {
                    tokenId: !tokenId ? 'missing' : 'ok',
                    customerEmail: !customerEmail ? 'missing' : 'ok',
                    customerName: !customerName ? 'missing' : 'ok'
                }
            }, { status: 400 });
        }

        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + (trialDays || 7));

        const purchaseCreate: any = {
            currency: 'USD',
            account: {
                code: customerEmail,
                email: customerEmail,
                first_name: customerName.split(' ')[0],
                last_name: customerName.split(' ').slice(1).join(' ') || 'Customer',
                billing_info: {
                    token_id: tokenId,
                },
            },
            subscriptions: [
                {
                    plan_code: 'dressfy',
                    trial_ends_at: trialEndsAt.toISOString(),
                },
            ],
            line_items: trialAmount > 0 ? [
                {
                    currency: 'USD',
                    item_code: 'paid-trial',
                    unit_amount: trialAmount,
                }
            ] : [],
        };

        // Note: Custom fields removed - they must be pre-defined in Recurly account settings
        // If you need to store metadata, first create the custom field in Recurly admin panel

        console.log('=== CREATING PURCHASE ===');
        console.log(JSON.stringify(purchaseCreate, null, 2));

        const purchase = await client.createPurchase(purchaseCreate);

        console.log('=== PURCHASE SUCCESS ===');

        return NextResponse.json({ success: true, purchase });
    } catch (error: any) {
        console.error('=== CHECKOUT ERROR ===');
        console.error('Full error:', JSON.stringify(error, null, 2));
        console.error('Message:', error.message);
        console.error('Type:', error.type);

        const errorDetails: any = {
            message: error.message || 'An error occurred',
            type: error.type || error.name || 'unknown',
            timestamp: new Date().toISOString(),
        };

        if (error.params) {
            console.error('Params:', error.params);
            errorDetails.validationErrors = error.params;
        }

        if (error.transactionError) {
            console.error('Transaction error:', error.transactionError);
            errorDetails.transactionError = error.transactionError;
        }

        if (error.code) {
            errorDetails.code = error.code;
        }

        if (error.statusCode) {
            errorDetails.statusCode = error.statusCode;
        }

        console.error('=== END ERROR ===');

        return NextResponse.json(
            {
                error: 'Checkout failed',
                details: errorDetails,
                hint: 'Check server console logs for complete error details'
            },
            { status: error.statusCode || 500 }
        );
    }
}
