import { PrismaClient, QuizDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

const newQuestions = [
  // Deutsche Geschichte & Kultur
  { prompt: "Wer komponierte die deutsche Nationalhymne?", choices: ["Joseph Haydn", "Ludwig van Beethoven", "Johann Sebastian Bach", "Wolfgang Amadeus Mozart"], answerIndex: 0, fact: "Die Melodie stammt aus Haydns Kaiserquartett von 1797.", tags: ["Deutschland", "Musik"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "In welchem Jahr wurde die Deutsche Mark eingeführt?", choices: ["1948", "1945", "1950", "1949"], answerIndex: 0, fact: "Die D-Mark löste die Reichsmark ab und beendete die Inflation.", tags: ["Deutschland", "Geschichte"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welcher deutsche Dichter schrieb 'Die Leiden des jungen Werther'?", choices: ["Goethe", "Schiller", "Heine", "Lessing"], answerIndex: 0, fact: "Das Buch löste 1774 einen regelrechten Hype aus - das 'Werther-Fieber'.", tags: ["Deutschland", "Literatur"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie heißt das größte Volksfest der Welt?", choices: ["Oktoberfest", "Karneval", "Weihnachtsmarkt", "Schützenfest"], answerIndex: 0, fact: "Das Oktoberfest in München zieht jährlich über 6 Millionen Besucher an.", tags: ["Deutschland", "Kultur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Stadt wird 'Elbflorenz' genannt?", choices: ["Dresden", "Hamburg", "Leipzig", "Magdeburg"], answerIndex: 0, fact: "Dresden erhielt den Beinamen wegen seiner Kunstschätze und barocken Architektur.", tags: ["Deutschland", "Geografie"], difficulty: QuizDifficulty.MEDIUM },
  
  // Natur & Umwelt
  { prompt: "Wie viele Beine hat ein Insekt?", choices: ["6", "8", "4", "10"], answerIndex: 0, fact: "Alle Insekten haben genau 6 Beine - das unterscheidet sie von Spinnen (8 Beine).", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welcher Baum wird am ältesten?", choices: ["Mammutbaum", "Eiche", "Tanne", "Buche"], answerIndex: 0, fact: "Manche Mammutbäume sind über 3.000 Jahre alt!", tags: ["Natur"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie heißt der größte Regenwald der Erde?", choices: ["Amazonas", "Kongo", "Borneo", "Sumatra"], answerIndex: 0, fact: "Der Amazonas-Regenwald produziert 20% des weltweiten Sauerstoffs.", tags: ["Natur", "Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Tier kann am schnellsten schwimmen?", choices: ["Schwertfisch", "Delfin", "Hai", "Thunfisch"], answerIndex: 0, fact: "Schwertfische erreichen Geschwindigkeiten bis zu 100 km/h!", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Flügel hat eine Biene?", choices: ["4", "2", "6", "8"], answerIndex: 0, fact: "Bienen haben 2 Flügelpaare, die sie beim Fliegen zusammenkoppeln.", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.MEDIUM },
  
  // Weltgeschichte
  { prompt: "Wer war der erste Präsident der USA?", choices: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"], answerIndex: 0, fact: "Washington war von 1789 bis 1797 Präsident.", tags: ["Geschichte"], difficulty: QuizDifficulty.EASY },
  { prompt: "In welchem Jahr landete der erste Mensch auf dem Mond?", choices: ["1969", "1968", "1970", "1971"], answerIndex: 0, fact: "Neil Armstrong betrat am 21. Juli 1969 als erster Mensch den Mond.", tags: ["Geschichte", "Wissenschaft"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie lange dauerte der Hundertjährige Krieg?", choices: ["116 Jahre", "100 Jahre", "99 Jahre", "120 Jahre"], answerIndex: 0, fact: "Der Krieg zwischen England und Frankreich dauerte von 1337 bis 1453.", tags: ["Geschichte"], difficulty: QuizDifficulty.HARD },
  { prompt: "Wer erfand den Buchdruck?", choices: ["Johannes Gutenberg", "Leonardo da Vinci", "Martin Luther", "Albrecht Dürer"], answerIndex: 0, fact: "Gutenberg erfand um 1450 den Buchdruck mit beweglichen Lettern.", tags: ["Geschichte"], difficulty: QuizDifficulty.EASY },
  { prompt: "In welchem Jahr begann die Französische Revolution?", choices: ["1789", "1776", "1792", "1799"], answerIndex: 0, fact: "Der Sturm auf die Bastille am 14. Juli 1789 gilt als Beginn.", tags: ["Geschichte"], difficulty: QuizDifficulty.MEDIUM },
  
  // Geografie
  { prompt: "Welches ist der höchste Berg Afrikas?", choices: ["Kilimandscharo", "Mount Kenya", "Atlas", "Ruwenzori"], answerIndex: 0, fact: "Der Kilimandscharo in Tansania ist 5.895 Meter hoch.", tags: ["Geografie"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Länder grenzen an Deutschland?", choices: ["9", "7", "8", "10"], answerIndex: 0, fact: "Dänemark, Polen, Tschechien, Österreich, Schweiz, Frankreich, Luxemburg, Belgien, Niederlande.", tags: ["Deutschland", "Geografie"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welches ist die Hauptstadt von Australien?", choices: ["Canberra", "Sydney", "Melbourne", "Brisbane"], answerIndex: 0, fact: "Viele denken es sei Sydney, aber Canberra ist die Hauptstadt seit 1908.", tags: ["Geografie"], difficulty: QuizDifficulty.HARD },
  { prompt: "Welcher Fluss ist der längste in Europa?", choices: ["Wolga", "Donau", "Rhein", "Elbe"], answerIndex: 0, fact: "Die Wolga ist 3.530 km lang und fließt durch Russland.", tags: ["Geografie"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Auf welchem Kontinent liegt die Sahara?", choices: ["Afrika", "Asien", "Australien", "Südamerika"], answerIndex: 0, fact: "Die Sahara ist mit 9 Millionen km² die größte Trockenwüste der Welt.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  
  // Wissenschaft & Technik
  { prompt: "Wer entwickelte die Relativitätstheorie?", choices: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Niels Bohr"], answerIndex: 0, fact: "Einstein veröffentlichte die spezielle Relativitätstheorie 1905.", tags: ["Wissenschaft"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Elemente gibt es im Periodensystem?", choices: ["118", "92", "100", "150"], answerIndex: 0, fact: "Das Periodensystem wird ständig erweitert - neue Elemente werden künstlich erzeugt.", tags: ["Wissenschaft", "Chemie"], difficulty: QuizDifficulty.HARD },
  { prompt: "Was ist der härteste natürliche Stoff?", choices: ["Diamant", "Stahl", "Granit", "Titan"], answerIndex: 0, fact: "Diamanten bestehen aus reinem Kohlenstoff in Kristallform.", tags: ["Wissenschaft"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie heißt die Wissenschaft von den Sternen?", choices: ["Astronomie", "Astrologie", "Kosmologie", "Astrophysik"], answerIndex: 0, fact: "Astronomie ist eine der ältesten Wissenschaften der Menschheit.", tags: ["Wissenschaft"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Organ produziert Insulin?", choices: ["Bauchspeicheldrüse", "Leber", "Niere", "Milz"], answerIndex: 0, fact: "Insulin reguliert den Blutzuckerspiegel im Körper.", tags: ["Wissenschaft", "Biologie"], difficulty: QuizDifficulty.MEDIUM },
  
  // Kunst & Kultur
  { prompt: "Wer malte 'Das letzte Abendmahl'?", choices: ["Leonardo da Vinci", "Michelangelo", "Raffael", "Caravaggio"], answerIndex: 0, fact: "Das Wandgemälde befindet sich in Mailand und wurde 1498 fertiggestellt.", tags: ["Kunst"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Symphonien komponierte Beethoven?", choices: ["9", "10", "8", "12"], answerIndex: 0, fact: "Die 9. Symphonie mit der 'Ode an die Freude' ist die berühmteste.", tags: ["Musik"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wer schrieb 'Der Herr der Ringe'?", choices: ["J.R.R. Tolkien", "C.S. Lewis", "George R.R. Martin", "J.K. Rowling"], answerIndex: 0, fact: "Tolkien arbeitete über 12 Jahre an der Trilogie.", tags: ["Literatur"], difficulty: QuizDifficulty.EASY },
  { prompt: "In welcher Stadt steht der Louvre?", choices: ["Paris", "London", "Rom", "Madrid"], answerIndex: 0, fact: "Der Louvre ist das meistbesuchte Museum der Welt mit über 10 Millionen Besuchern jährlich.", tags: ["Kultur", "Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wer komponierte 'Die vier Jahreszeiten'?", choices: ["Antonio Vivaldi", "Johann Sebastian Bach", "Georg Friedrich Händel", "Wolfgang Amadeus Mozart"], answerIndex: 0, fact: "Vivaldi komponierte das Werk 1725 - es gehört zu den bekanntesten Barockstücken.", tags: ["Musik"], difficulty: QuizDifficulty.MEDIUM },
  
  // Sport
  { prompt: "Wie viele Spieler sind in einem Basketballteam auf dem Feld?", choices: ["5", "6", "7", "4"], answerIndex: 0, fact: "Basketball wurde 1891 von James Naismith erfunden.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Land gewann die erste Fußball-Weltmeisterschaft?", choices: ["Uruguay", "Brasilien", "Deutschland", "Italien"], answerIndex: 0, fact: "Uruguay gewann 1930 die erste WM im eigenen Land.", tags: ["Sport", "Fußball"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Runden hat ein Boxkampf normalerweise?", choices: ["12", "10", "15", "8"], answerIndex: 0, fact: "Früher gab es 15 Runden, seit 1988 sind es maximal 12.", tags: ["Sport"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welche Sportart wird mit einem Federball gespielt?", choices: ["Badminton", "Tennis", "Squash", "Tischtennis"], answerIndex: 0, fact: "Der Federball kann Geschwindigkeiten über 400 km/h erreichen!", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Punkte gibt es für einen Korb beim Basketball?", choices: ["2 oder 3", "1 oder 2", "3 oder 4", "Immer 2"], answerIndex: 0, fact: "2 Punkte innerhalb der 3-Punkte-Linie, 3 Punkte außerhalb.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  
  // Essen & Trinken
  { prompt: "Aus welchem Land kommt Sushi?", choices: ["Japan", "China", "Korea", "Thailand"], answerIndex: 0, fact: "Sushi bedeutet wörtlich 'saurer Reis'.", tags: ["Essen", "Kultur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Gemüse macht den größten Teil von Sauerkraut aus?", choices: ["Weißkohl", "Rotkohl", "Wirsing", "Chinakohl"], answerIndex: 0, fact: "Sauerkraut entsteht durch Milchsäuregärung und ist sehr gesund.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Aus welcher Frucht wird Rosinen gemacht?", choices: ["Trauben", "Pflaumen", "Aprikosen", "Datteln"], answerIndex: 0, fact: "Rosinen sind getrocknete Weintrauben und sehr zuckerhaltig.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Land ist berühmt für Paella?", choices: ["Spanien", "Italien", "Frankreich", "Portugal"], answerIndex: 0, fact: "Paella kommt ursprünglich aus Valencia und wird in einer großen Pfanne zubereitet.", tags: ["Essen", "Kultur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist der Hauptbestandteil von Guacamole?", choices: ["Avocado", "Tomate", "Paprika", "Gurke"], answerIndex: 0, fact: "Guacamole ist eine mexikanische Spezialität aus zerdrückten Avocados.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },
  
  // Tiere
  { prompt: "Welches Tier hat den längsten Hals?", choices: ["Giraffe", "Strauß", "Schwan", "Kamel"], answerIndex: 0, fact: "Der Hals einer Giraffe kann bis zu 2,5 Meter lang werden!", tags: ["Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie nennt man ein weibliches Reh?", choices: ["Ricke", "Hirschkuh", "Reh", "Geiß"], answerIndex: 0, fact: "Männliche Rehe heißen Bock, junge Rehe heißen Kitz.", tags: ["Tiere"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welches Tier kann am längsten ohne Wasser überleben?", choices: ["Kamel", "Elefant", "Känguru", "Wüstenfuchs"], answerIndex: 0, fact: "Kamele können bis zu 2 Wochen ohne Wasser auskommen.", tags: ["Tiere"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Zehen hat eine Katze an den Vorderpfoten?", choices: ["5", "4", "6", "3"], answerIndex: 0, fact: "An den Hinterpfoten haben Katzen nur 4 Zehen.", tags: ["Tiere"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welches Tier legt die größten Eier?", choices: ["Strauß", "Emu", "Kasuar", "Albatros"], answerIndex: 0, fact: "Ein Straußenei wiegt etwa 1,5 kg - so viel wie 24 Hühnereier!", tags: ["Tiere"], difficulty: QuizDifficulty.EASY },
  
  // Allgemeinwissen
  { prompt: "Wie viele Zähne hat ein erwachsener Mensch normalerweise?", choices: ["32", "28", "30", "34"], answerIndex: 0, fact: "Inklusive der 4 Weisheitszähne sind es 32 Zähne.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Farbe hat ein Smaragd?", choices: ["Grün", "Rot", "Blau", "Gelb"], answerIndex: 0, fact: "Smaragde gehören zu den wertvollsten Edelsteinen der Welt.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Bundesländer hat Deutschland?", choices: ["16", "15", "17", "14"], answerIndex: 0, fact: "Die 16 Bundesländer haben unterschiedliche Größen und Einwohnerzahlen.", tags: ["Deutschland"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welcher Wochentag kommt nach Mittwoch?", choices: ["Donnerstag", "Dienstag", "Freitag", "Montag"], answerIndex: 0, fact: "Donnerstag ist nach dem germanischen Gott Donar (Thor) benannt.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Cent sind ein Euro?", choices: ["100", "50", "10", "1000"], answerIndex: 0, fact: "Der Euro wurde 2002 als Bargeld in 12 EU-Ländern eingeführt.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
];

async function main() {
  console.log('📥 Adding 50 new questions with fun facts...');

  let added = 0;
  let skipped = 0;

  // Get existing questions
  const existing = await prisma.quizQuestion.findMany();
  const existingPrompts = new Set(existing.map(q => q.prompt));

  for (const q of newQuestions) {
    if (existingPrompts.has(q.prompt)) {
      console.log(`⏭️  Skipping duplicate: "${q.prompt.substring(0, 50)}..."`);
      skipped++;
      continue;
    }

    try {
      await prisma.quizQuestion.create({
        data: {
          prompt: q.prompt,
          choices: JSON.stringify(q.choices),
          answerIndex: q.answerIndex,
          fact: q.fact,
          tags: JSON.stringify(q.tags),
          difficulty: q.difficulty,
        },
      });
      added++;
      console.log(`✅ Added: "${q.prompt.substring(0, 50)}..."`);
    } catch (error) {
      console.error(`❌ Error adding question: ${q.prompt}`, error);
    }
  }

  const total = await prisma.quizQuestion.count();
  
  console.log(`\n✅ Added ${added} new questions`);
  console.log(`⏭️  Skipped ${skipped} questions (duplicates)`);
  console.log(`📊 Total questions in database: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

