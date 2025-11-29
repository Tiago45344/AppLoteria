import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Cliente Supabase para atualizar banco de dados
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Webhook secret do Stripe (configure no dashboard do Stripe)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura do webhook ausente' },
        { status: 400 }
      );
    }

    // Verificar assinatura do webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erro na verificação do webhook:', err);
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      );
    }

    // Processar eventos do Stripe
    switch (event.type) {
      // Quando checkout é completado
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      // Quando assinatura é criada
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      // Quando assinatura é atualizada
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      // Quando assinatura é cancelada
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      // Quando pagamento é bem-sucedido
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      // Quando pagamento falha
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Handler: Checkout completado
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerEmail) return;

  // Buscar usuário pelo email
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerEmail)
    .single();

  if (user) {
    await supabase
      .from('users')
      .update({
        is_premium: true,
        stripe_customer_id: customerId,
        subscription_id: subscriptionId,
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    console.log(`✅ Premium ativado para usuário: ${customerEmail}`);
  }
}

// Handler: Assinatura criada
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;

  await supabase
    .from('users')
    .update({
      is_premium: true,
      subscription_id: subscriptionId,
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  console.log(`✅ Assinatura criada: ${subscriptionId}`);
}

// Handler: Assinatura atualizada
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  await supabase
    .from('users')
    .update({
      subscription_status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscriptionId);

  console.log(`✅ Assinatura atualizada: ${subscriptionId} - Status: ${subscription.status}`);
}

// Handler: Assinatura cancelada
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  await supabase
    .from('users')
    .update({
      is_premium: false,
      subscription_status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscriptionId);

  console.log(`❌ Assinatura cancelada: ${subscriptionId}`);
}

// Handler: Pagamento bem-sucedido
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (subscriptionId) {
    await supabase
      .from('users')
      .update({
        is_premium: true,
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId);

    console.log(`✅ Pagamento confirmado para assinatura: ${subscriptionId}`);
  }
}

// Handler: Pagamento falhou
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (subscriptionId) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId);

    console.log(`⚠️ Pagamento falhou para assinatura: ${subscriptionId}`);
  }
}
