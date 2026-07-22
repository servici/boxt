import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, coinsAdded, paymentMethod } = await req.json();

    if (!amount || !coinsAdded) {
      return NextResponse.json({ error: 'Amount and coinsAdded are required' }, { status: 400 });
    }

    const [purchase, updatedUser] = await prisma.$transaction([
      prisma.purchase.create({
        data: {
          userId: userPayload.userId,
          amount: parseFloat(amount),
          coinsAdded: parseInt(coinsAdded, 10),
          paymentMethod: paymentMethod || 'Simulated Payment Gateway',
        },
      }),
      prisma.user.update({
        where: { id: userPayload.userId },
        data: {
          coinsBalance: { increment: parseInt(coinsAdded, 10) },
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Purchase completed successfully!',
      coinsBalance: updatedUser.coinsBalance,
      purchase,
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 });
  }
}
