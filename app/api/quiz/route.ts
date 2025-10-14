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
      const isBuchstabensalatSelected = tags.includes('Buchstabensalat');

      filteredQuestions = filteredQuestions.filter(q => {
        const hasBuchstabensalatTag = q.tags.includes('Buchstabensalat');

        // Special handling for Buchstabensalat questions:
        // - If Buchstabensalat is NOT selected, exclude all Buchstabensalat questions
        // - If Buchstabensalat IS selected, include all Buchstabensalat questions
        if (hasBuchstabensalatTag) {
          return isBuchstabensalatSelected;
        }

        // For non-Buchstabensalat questions, use normal tag matching
        return tags.some(tag => q.tags.includes(tag.trim()));
      });
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

