import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const event = constructWebhookEvent(body, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        
        // Update subscription
        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        
        if (subscription) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: {
              plan: 'PRO',
              stripeSubscriptionId: session.subscription as string,
              status: 'active',
            },
          });
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const dbSubscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        
        if (dbSubscription) {
          await db.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              plan: subscription.status === 'active' ? 'PRO' : 'FREE',
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const dbSubscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        
        if (dbSubscription) {
          await db.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              plan: 'FREE',
              status: 'canceled',
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
