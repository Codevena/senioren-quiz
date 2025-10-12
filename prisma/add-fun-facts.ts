import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fun-Facts für Fragen ohne Fact
const funFacts: { [key: string]: string } = {
  // Geografie
  "Welche Stadt ist die Hauptstadt von Deutschland?": "Berlin hat 3,7 Millionen Einwohner und ist die größte Stadt Deutschlands.",
  "Welcher Fluss fließt durch Hamburg?": "Die Elbe ist 1.094 km lang und mündet in die Nordsee.",
  "Wie heißt das höchste Gebirge in Deutschland?": "Die Zugspitze ist 2.962 Meter hoch und liegt an der Grenze zu Österreich.",
  "Welches Bundesland ist das größte in Deutschland?": "Bayern hat eine Fläche von 70.550 km² - größer als Irland!",
  "In welcher Stadt steht das Brandenburger Tor?": "Das Brandenburger Tor wurde 1791 fertiggestellt und ist 26 Meter hoch.",
  
  // Geschichte
  "Wann wurde die Bundesrepublik Deutschland gegründet?": "Das Grundgesetz trat am 23. Mai 1949 in Kraft.",
  "Wer war der erste Bundeskanzler der BRD?": "Konrad Adenauer war von 1949 bis 1963 Bundeskanzler - 14 Jahre lang!",
  "In welchem Jahr fiel die Berliner Mauer?": "Die Mauer stand 28 Jahre lang und teilte Berlin in Ost und West.",
  "Wann endete der Zweite Weltkrieg in Europa?": "Am 8. Mai 1945 kapitulierte Deutschland bedingungslos.",
  
  // Natur & Tiere
  "Welches Tier ist das größte Landsäugetier?": "Afrikanische Elefanten können bis zu 6 Tonnen wiegen!",
  "Wie viele Beine hat eine Spinne?": "Spinnen haben außerdem 8 Augen - manche sogar 12!",
  "Welcher Vogel kann nicht fliegen?": "Pinguine können dafür hervorragend schwimmen und tauchen.",
  "Wie nennt man ein männliches Pferd?": "Weibliche Pferde heißen Stute, junge Pferde Fohlen.",
  
  // Wissenschaft
  "Wie viele Planeten hat unser Sonnensystem?": "Pluto wurde 2006 zum Zwergplaneten herabgestuft.",
  "Was ist die chemische Formel für Wasser?": "H2O besteht aus 2 Wasserstoff- und 1 Sauerstoffatom.",
  "Wie heißt der größte Planet in unserem Sonnensystem?": "Jupiter ist so groß, dass alle anderen Planeten hineinpassen würden!",
  "Bei welcher Temperatur gefriert Wasser?": "Bei 0°C wird Wasser zu Eis, bei 100°C zu Dampf.",
  
  // Kultur
  "Wer malte das berühmte Bild 'Die Mona Lisa'?": "Die Mona Lisa hängt im Louvre in Paris und ist unbezahlbar.",
  "Wie viele Saiten hat eine normale Gitarre?": "Es gibt auch 12-saitige Gitarren für volleren Klang.",
  "Wer schrieb das Werk 'Faust'?": "Goethe arbeitete fast 60 Jahre an seinem Faust!",
  "Wie viele Tasten hat ein Klavier?": "52 weiße und 36 schwarze Tasten ergeben zusammen 88.",
  
  // Sport
  "Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?": "10 Feldspieler plus 1 Torwart = 11 Spieler.",
  "Wie oft finden Olympische Sommerspiele statt?": "Die ersten modernen Olympischen Spiele waren 1896 in Athen.",
  "Wie lang ist ein Marathon?": "Die Strecke erinnert an den Lauf des Boten von Marathon nach Athen.",
  "Welche Farbe hat das Trikot des Führenden bei der Tour de France?": "Das gelbe Trikot gibt es seit 1919.",
  
  // Essen
  "Aus welchem Land kommt die Pizza?": "Die erste Pizza Margherita wurde 1889 in Neapel gebacken.",
  "Was ist das Hauptgetreide für Brot in Deutschland?": "Roggen und Weizen sind die wichtigsten Brotsorten in Deutschland.",
  "Welche Frucht ist botanisch gesehen eine Beere?": "Erdbeeren sind botanisch keine Beeren, sondern Sammelnussfrüchte!",
  "Aus welcher Pflanze wird Schokolade hergestellt?": "Kakaobohnen wachsen direkt am Stamm des Kakaobaums.",
  
  // Allgemeinwissen
  "Wie viele Tage hat ein Jahr?": "Alle 4 Jahre gibt es ein Schaltjahr mit 366 Tagen.",
  "Wie viele Monate hat ein Jahr?": "Die Monatsnamen stammen aus dem Lateinischen.",
  "Wie viele Stunden hat ein Tag?": "Die Erde dreht sich in 24 Stunden einmal um ihre Achse.",
  "Welche Farbe entsteht, wenn man Rot und Gelb mischt?": "Orange ist eine der drei Sekundärfarben.",
  
  // Technologie
  "Was bedeutet WWW?": "Tim Berners-Lee erfand das World Wide Web 1989 am CERN.",
  "Wer gründete Microsoft?": "Bill Gates gründete Microsoft 1975 zusammen mit Paul Allen.",
  "Welches Unternehmen stellt das iPhone her?": "Das erste iPhone kam 2007 auf den Markt und revolutionierte Smartphones.",
  
  // Mehr Geografie
  "Welches ist die Hauptstadt von Frankreich?": "Paris wird auch 'Stadt der Liebe' genannt.",
  "Welches ist die Hauptstadt von Italien?": "Rom wurde der Legende nach 753 v. Chr. gegründet.",
  "Welches ist die Hauptstadt von Spanien?": "Madrid liegt auf 667 Metern Höhe - eine der höchsten Hauptstädte Europas.",
  "Welcher Ozean ist der größte?": "Der Pazifik ist größer als alle Landmassen zusammen!",
  
  // Mehr Tiere
  "Welches Tier kann nicht rückwärts laufen?": "Kängurus können dafür bis zu 3 Meter hoch springen!",
  "Wie nennt man eine Gruppe von Löwen?": "Ein Rudel kann aus bis zu 30 Löwen bestehen.",
  "Welches Tier schläft im Stehen?": "Pferde haben einen speziellen 'Steh-Schlaf-Mechanismus'.",
  "Wie viele Herzen hat ein Oktopus?": "Oktopusse haben außerdem blaues Blut!",
  
  // Mehr Wissenschaft
  "Wie heißt der rote Planet?": "Mars hat zwei kleine Monde: Phobos und Deimos.",
  "Was ist die Hauptzutat von Glas?": "Glas wird bei über 1.500°C geschmolzen.",
  "Wie schnell ist Licht?": "Licht könnte in einer Sekunde 7,5 Mal um die Erde reisen!",
  "Welches Element hat das Symbol 'Au'?": "Gold ist eines der seltensten Elemente auf der Erde.",
  
  // Mehr Kultur
  "Wer schrieb 'Romeo und Julia'?": "Shakespeare schrieb über 37 Theaterstücke und 154 Sonette.",
  "Wie viele Noten gibt es in der Musik?": "Die 7 Stammtöne sind: C, D, E, F, G, A, H (bzw. B).",
  "Wer malte 'Die Sternennacht'?": "Van Gogh malte das Bild 1889 in einer psychiatrischen Klinik.",
  "In welcher Stadt steht die Freiheitsstatue?": "Die Statue war ein Geschenk Frankreichs zur Unabhängigkeit der USA.",
  
  // Mehr Sport
  "Wie viele Spieler hat eine Handballmannschaft auf dem Feld?": "Handball wurde 1917 in Deutschland erfunden.",
  "Wie viele Löcher hat ein Golfplatz normalerweise?": "Der kleinste Golfplatz hat nur 9 Löcher.",
  "Welche Sportart wird auf Eis gespielt?": "Eishockey ist der Nationalsport Kanadas.",
  "Welche Farbe hat der Ball beim Tennis?": "Tennisbälle waren bis 1972 weiß, dann wurden sie gelb für bessere TV-Sichtbarkeit.",
  
  // Mehr Essen
  "Aus welchem Land kommt Sauerkraut?": "Sauerkraut ist reich an Vitamin C und war wichtig gegen Skorbut.",
  "Was ist Tofu?": "Tofu wird seit über 2.000 Jahren in China hergestellt.",
  "Welche Farbe hat eine reife Banane?": "Bananen reifen nach der Ernte nach - sie werden grün gepflückt.",
  "Was ist Pasta?": "Es gibt über 600 verschiedene Pasta-Formen!",
  
  // Mehr Allgemeinwissen
  "Wie viele Sekunden hat eine Minute?": "Eine Stunde hat 3.600 Sekunden.",
  "Welche Farbe hat ein Stoppschild?": "Stoppschilder sind weltweit rot - außer in Japan (dort sind sie blau).",
  "Wie viele Finger hat eine Hand?": "Der Daumen ist der stärkste Finger.",
  "Welche Farbe entsteht wenn man Rot und Blau mischt?": "Lila ist die Farbe der Könige und Kaiser.",
  "Wie viele Wochen hat ein Jahr?": "Genau sind es 52 Wochen und 1 Tag (bzw. 2 Tage im Schaltjahr).",
};

async function main() {
  console.log('📝 Adding fun facts to questions...');

  let updated = 0;
  let skipped = 0;

  const questions = await prisma.quizQuestion.findMany();

  for (const question of questions) {
    // Skip if already has a fact
    if (question.fact) {
      skipped++;
      continue;
    }

    // Check if we have a fun fact for this question
    const fact = funFacts[question.prompt];
    if (fact) {
      await prisma.quizQuestion.update({
        where: { id: question.id },
        data: { fact },
      });
      updated++;
      console.log(`✅ Added fact to: "${question.prompt.substring(0, 50)}..."`);
    } else {
      skipped++;
    }
  }

  console.log(`\n✅ Updated ${updated} questions with fun facts`);
  console.log(`⏭️  Skipped ${skipped} questions (already have facts or no match)`);
  
  const totalWithFacts = await prisma.quizQuestion.count({
    where: { fact: { not: null } },
  });
  const totalQuestions = await prisma.quizQuestion.count();
  
  console.log(`📊 Total: ${totalWithFacts}/${totalQuestions} questions have fun facts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

