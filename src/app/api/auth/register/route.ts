import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { Role } from '@/types';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || email.split('@')[0],
        coinsBalance: 50,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    setAuthCookie(token);

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        coinsBalance: user.coinsBalance,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
