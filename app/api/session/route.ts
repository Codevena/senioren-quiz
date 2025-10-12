import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate a simple 6-character code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST() {
  try {
    let code = generateCode();
    let attempts = 0;
    
    // Ensure unique code
    while (attempts < 10) {
      const existing = await prisma.session.findUnique({
        where: { code }
      });
      
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    const session = await prisma.session.create({
      data: { code }
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

