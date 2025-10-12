import { NextRequest, NextResponse } from 'next/server';
import questionsData from '@/lib/questions-data.json';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '1000', 10);
    const tags = searchParams.get('tags')?.split(',') || [];
    const difficulty = searchParams.get('difficulty') || null;

    // Filter questions
    let filteredQuestions = [...questionsData];

    if (tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q =>
        tags.some(tag => q.tags.includes(tag.trim()))
      );
    }

    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q =>
        q.difficulty === difficulty
      );
    }

    // Limit results
    const limitedQuestions = filteredQuestions.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedQuestions,
      count: limitedQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

