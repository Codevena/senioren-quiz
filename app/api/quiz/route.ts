import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QuizDifficulty } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const tags = searchParams.get('tags')?.split(',') || [];
    const difficulty = searchParams.get('difficulty') as QuizDifficulty | null;

    // Build where clause
    const where: any = {};
    
    if (tags.length > 0) {
      // Filter by tags - check if any of the requested tags are in the question's tags
      where.OR = tags.map(tag => ({
        tags: {
          contains: tag.trim()
        }
      }));
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const questions = await prisma.quizQuestion.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Parse JSON strings back to arrays
    const parsedQuestions = questions.map(q => ({
      ...q,
      choices: JSON.parse(q.choices),
      tags: JSON.parse(q.tags),
    }));

    return NextResponse.json({
      success: true,
      data: parsedQuestions,
      count: parsedQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

