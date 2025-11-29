import { NextRequest, NextResponse } from 'next/server';
import { verifyCheckoutSession } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase para atualizar status do usuário
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID não fornecido' },
        { status: 400 }
      );
    }

    // Verificar pagamento no Stripe
    const verification = await verifyCheckoutSession(sessionId);

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error },
        { status: 400 }
      );
    }

    // Se pagamento foi bem-sucedido, atualizar status do usuário no Supabase
    if (verification.status === 'paid') {
      const { error } = await supabase
        .from('users')
        .update({
          is_premium: true,
          subscription_id: verification.subscriptionId,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return NextResponse.json(
          { error: 'Erro ao ativar premium' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Premium ativado com sucesso!',
        isPremium: true,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Pagamento ainda não foi confirmado',
      status: verification.status,
    });
  } catch (error) {
    console.error('Erro na verificação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
