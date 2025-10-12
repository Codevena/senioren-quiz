import { PrismaClient, QuizDifficulty } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('📥 Importing questions from quiz_fragen.json...');

  // Read JSON file
  const jsonPath = path.join(process.cwd(), 'quiz_fragen.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const questions = JSON.parse(jsonData);

  console.log(`Found ${questions.length} questions in JSON file`);

  // Get existing questions to avoid duplicates
  const existing = await prisma.quizQuestion.findMany();
  const existingPrompts = new Set(existing.map(q => q.prompt));

  let imported = 0;
  let skipped = 0;

  for (const q of questions) {
    // Skip if already exists
    if (existingPrompts.has(q.prompt)) {
      skipped++;
      continue;
    }

    // Ensure 4 choices
    if (q.choices.length < 4) {
      console.warn(`⚠️  Skipping question with < 4 choices: ${q.prompt}`);
      skipped++;
      continue;
    }

    try {
      await prisma.quizQuestion.create({
        data: {
          prompt: q.prompt,
          choices: JSON.stringify(q.choices),
          answerIndex: q.answerIndex,
          fact: q.fact || '',
          tags: JSON.stringify(q.tags || []),
          difficulty: q.difficulty as QuizDifficulty || QuizDifficulty.MEDIUM,
        },
      });
      imported++;
    } catch (error) {
      console.error(`Error importing question: ${q.prompt}`, error);
    }
  }

  console.log(`✅ Imported ${imported} new questions`);
  console.log(`⏭️  Skipped ${skipped} questions (duplicates or invalid)`);
  console.log(`📊 Total questions in database: ${existing.length + imported}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

