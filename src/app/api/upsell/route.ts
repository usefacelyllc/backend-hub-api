import { NextResponse } from 'next/server';
import { client } from '../../../lib/recurly';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerEmail, itemCode, amount } = body;

        if (!customerEmail || !itemCode) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: {
                    customerEmail: !customerEmail ? 'missing' : 'ok',
                    itemCode: !itemCode ? 'missing' : 'ok'
                }
            }, { status: 400 });
        }

        // Verify account exists
        let account;
        try {
            account = await client.getAccount(customerEmail);
            console.log('Account found:', account.code);
        } catch (e: any) {
            console.error('Account lookup error:', e.message);
            return NextResponse.json({
                error: 'Account not found',
                details: {
                    email: customerEmail,
                    hint: 'Customer must complete checkout first before using upsell'
                }
            }, { status: 404 });
        }

        const purchaseCreate: any = {
            currency: 'USD',
            account: {
                code: customerEmail,
            },
            line_items: [
                {
                    currency: 'USD',
                    item_code: itemCode,
                }
            ]
        };

        if (amount !== undefined) {
            purchaseCreate.line_items[0].unit_amount = amount;
        }

        console.log('Creating upsell purchase:', JSON.stringify(purchaseCreate, null, 2));

        const purchase = await client.createPurchase(purchaseCreate);

        return NextResponse.json({ success: true, purchase });
    } catch (error: any) {
        console.error('Upsell Error Details:', {
            message: error.message,
            type: error.type,
            params: error.params,
            apiError: error.apiError,
            recurlyError: error.recurlyError,
            fullError: error
        });

        // Extract detailed error information
        const errorDetails: any = {
            message: error.message || 'An error occurred during upsell',
            type: error.type || 'unknown',
        };

        if (error.params) {
            errorDetails.params = error.params;
        }

        if (error.apiError) {
            errorDetails.apiError = error.apiError;
        }

        if (error.transactionError) {
            errorDetails.transactionError = error.transactionError;
        }

        if (error.recurlyError) {
            errorDetails.recurlyError = error.recurlyError;
        }

        return NextResponse.json(
            {
                error: 'Upsell failed',
                details: errorDetails,
                hint: 'Check console logs for full error details'
            },
            { status: 500 }
        );
    }
}
