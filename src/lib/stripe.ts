import Stripe from 'stripe';

// Cliente Stripe para verificação de pagamentos
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Chave publicável do Stripe (para uso no frontend)
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SW0WKR10Swid3g22Qh7gezKCAWXi703ArsOs23PFxEiFJhdULSKWSvf287wnys0j0MhC4TsF6L6R7f8Rvl1bxq100RTk1SjVg';

// ID do preço da assinatura
export const SUBSCRIPTION_PRICE_ID = 'price_1SXptgR10Swid3g2tHRdMAIU';

// URL base do app
export const APP_URL = 'https://3a24273f-app-loteria-pi.lasy.pro';

// Criar sessão de checkout para assinatura
export async function createSubscriptionCheckout(params: {
  customerEmail?: string;
  userId?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: params.customerEmail,
      success_url: params.successUrl || `${APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || APP_URL,
      metadata: {
        ...params.metadata,
        userId: params.userId || '',
      },
      subscription_data: {
        metadata: {
          ...params.metadata,
          userId: params.userId || '',
        },
      },
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return {
      success: false,
      error: 'Erro ao criar sessão de checkout',
    };
  }
}

// Verificar status de uma sessão de checkout
export async function verifyCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      success: true,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerId: session.customer,
      subscriptionId: session.subscription,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return {
      success: false,
      error: 'Erro ao verificar pagamento',
    };
  }
}

// Verificar status de uma assinatura
export async function verifySubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return {
      success: true,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      customerId: subscription.customer,
    };
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return {
      success: false,
      error: 'Erro ao verificar assinatura',
    };
  }
}

// Cancelar assinatura
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return {
      success: true,
      status: subscription.status,
    };
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    return {
      success: false,
      error: 'Erro ao cancelar assinatura',
    };
  }
}
