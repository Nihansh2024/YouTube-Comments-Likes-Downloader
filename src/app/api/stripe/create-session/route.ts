import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { createCheckoutSession, createStripeCustomer, STRIPE_PLANS } from '../../../../lib/stripe';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    
    if (!customerId) {
      customerId = await createStripeCustomer(user.email, user.name || undefined);
      
      await db.subscription.update({
        where: { userId: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = STRIPE_PLANS.PRO.priceId;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const checkoutUrl = await createCheckoutSession(
      customerId,
      priceId,
      `${origin}/dashboard?success=true`,
      `${origin}/pricing?canceled=true`
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
