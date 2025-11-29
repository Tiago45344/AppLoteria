import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckout } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, userId, metadata } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email do cliente é obrigatório' },
        { status: 400 }
      );
    }

    // Criar sessão de checkout
    const result = await createSubscriptionCheckout({
      customerEmail,
      userId,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
