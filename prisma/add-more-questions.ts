import { PrismaClient, QuizDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

const newQuestions = [
  // Geografie
  { prompt: "Welcher ist der längste Fluss der Welt?", choices: ["Nil", "Amazonas", "Rhein", "Donau"], answerIndex: 0, fact: "Der Nil ist etwa 6.650 km lang.", tags: ["Geografie", "Natur"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Kontinente gibt es?", choices: ["7", "5", "6", "8"], answerIndex: 0, fact: "Afrika, Antarktika, Asien, Australien, Europa, Nordamerika, Südamerika.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches ist das größte Land der Erde?", choices: ["Russland", "Kanada", "China", "USA"], answerIndex: 0, fact: "Russland hat über 17 Millionen km².", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "In welchem Land steht der Eiffelturm?", choices: ["Frankreich", "Italien", "Spanien", "Belgien"], answerIndex: 0, fact: "Der Eiffelturm steht in Paris.", tags: ["Geografie", "Kultur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches ist das kleinste Land der Welt?", choices: ["Vatikanstadt", "Monaco", "San Marino", "Liechtenstein"], answerIndex: 0, fact: "Der Vatikan hat nur 0,44 km².", tags: ["Geografie"], difficulty: QuizDifficulty.MEDIUM },
  
  // Geschichte
  { prompt: "Wann endete der Zweite Weltkrieg?", choices: ["1945", "1944", "1946", "1943"], answerIndex: 0, fact: "Der Krieg endete am 8. Mai 1945 in Europa.", tags: ["Geschichte"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wer war der erste Bundeskanzler Deutschlands?", choices: ["Konrad Adenauer", "Willy Brandt", "Helmut Kohl", "Ludwig Erhard"], answerIndex: 0, fact: "Adenauer war von 1949 bis 1963 im Amt.", tags: ["Geschichte", "Deutschland"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "In welchem Jahr fiel die Berliner Mauer?", choices: ["1989", "1990", "1988", "1991"], answerIndex: 0, fact: "Die Mauer fiel am 9. November 1989.", tags: ["Geschichte", "Deutschland"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wer entdeckte Amerika?", choices: ["Christoph Kolumbus", "Amerigo Vespucci", "Ferdinand Magellan", "Marco Polo"], answerIndex: 0, fact: "Kolumbus landete 1492 in der Karibik.", tags: ["Geschichte"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wann begann der Erste Weltkrieg?", choices: ["1914", "1913", "1915", "1916"], answerIndex: 0, fact: "Der Krieg begann am 28. Juli 1914.", tags: ["Geschichte"], difficulty: QuizDifficulty.MEDIUM },
  
  // Natur & Tiere
  { prompt: "Welches ist das größte Tier der Welt?", choices: ["Blauwal", "Elefant", "Giraffe", "Hai"], answerIndex: 0, fact: "Blauwale können bis zu 30 Meter lang werden.", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Beine hat eine Spinne?", choices: ["8", "6", "10", "12"], answerIndex: 0, fact: "Spinnen gehören zu den Spinnentieren.", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Tier ist das schnellste Landtier?", choices: ["Gepard", "Löwe", "Pferd", "Antilope"], answerIndex: 0, fact: "Geparden erreichen bis zu 120 km/h.", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie nennt man ein junges Pferd?", choices: ["Fohlen", "Kalb", "Lamm", "Ferkel"], answerIndex: 0, fact: "Fohlen können schon nach wenigen Stunden stehen.", tags: ["Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Tier legt Eier und säugt seine Jungen?", choices: ["Schnabeltier", "Känguru", "Wal", "Delfin"], answerIndex: 0, fact: "Das Schnabeltier ist ein Kloakentier.", tags: ["Natur", "Tiere"], difficulty: QuizDifficulty.HARD },
  
  // Wissenschaft
  { prompt: "Wie viele Planeten hat unser Sonnensystem?", choices: ["8", "9", "7", "10"], answerIndex: 0, fact: "Pluto gilt seit 2006 nicht mehr als Planet.", tags: ["Wissenschaft", "Astronomie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist H2O?", choices: ["Wasser", "Sauerstoff", "Wasserstoff", "Salz"], answerIndex: 0, fact: "H2O besteht aus 2 Wasserstoff- und 1 Sauerstoffatom.", tags: ["Wissenschaft", "Chemie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie heißt der größte Planet unseres Sonnensystems?", choices: ["Jupiter", "Saturn", "Neptun", "Uranus"], answerIndex: 0, fact: "Jupiter ist 11-mal größer als die Erde.", tags: ["Wissenschaft", "Astronomie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Bei welcher Temperatur gefriert Wasser?", choices: ["0°C", "10°C", "-10°C", "5°C"], answerIndex: 0, fact: "Bei 0 Grad Celsius wird Wasser zu Eis.", tags: ["Wissenschaft", "Physik"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Knochen hat ein erwachsener Mensch?", choices: ["206", "180", "220", "250"], answerIndex: 0, fact: "Babys haben noch mehr Knochen, die später verwachsen.", tags: ["Wissenschaft", "Biologie"], difficulty: QuizDifficulty.MEDIUM },
  
  // Kultur & Kunst
  { prompt: "Wer malte die Mona Lisa?", choices: ["Leonardo da Vinci", "Michelangelo", "Picasso", "Van Gogh"], answerIndex: 0, fact: "Das Gemälde hängt im Louvre in Paris.", tags: ["Kultur", "Kunst"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Saiten hat eine Gitarre normalerweise?", choices: ["6", "5", "7", "8"], answerIndex: 0, fact: "Es gibt auch 12-saitige Gitarren.", tags: ["Kultur", "Musik"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wer schrieb 'Faust'?", choices: ["Goethe", "Schiller", "Heine", "Kafka"], answerIndex: 0, fact: "Johann Wolfgang von Goethe lebte von 1749 bis 1832.", tags: ["Kultur", "Literatur"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Tasten hat ein Klavier?", choices: ["88", "76", "100", "64"], answerIndex: 0, fact: "52 weiße und 36 schwarze Tasten.", tags: ["Kultur", "Musik"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wer komponierte die 'Kleine Nachtmusik'?", choices: ["Mozart", "Beethoven", "Bach", "Haydn"], answerIndex: 0, fact: "Wolfgang Amadeus Mozart komponierte sie 1787.", tags: ["Kultur", "Musik"], difficulty: QuizDifficulty.MEDIUM },
  
  // Sport
  { prompt: "Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?", choices: ["11", "10", "12", "9"], answerIndex: 0, fact: "Plus Auswechselspieler auf der Bank.", tags: ["Sport", "Fußball"], difficulty: QuizDifficulty.EASY },
  { prompt: "Alle wie viele Jahre finden Olympische Spiele statt?", choices: ["4", "2", "5", "3"], answerIndex: 0, fact: "Sommer- und Winterspiele wechseln sich ab.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie lang ist ein Marathon?", choices: ["42,195 km", "40 km", "45 km", "50 km"], answerIndex: 0, fact: "Die Distanz wurde 1921 standardisiert.", tags: ["Sport"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welche Farbe hat das Trikot des Führenden bei der Tour de France?", choices: ["Gelb", "Grün", "Rot", "Blau"], answerIndex: 0, fact: "Das gelbe Trikot heißt 'Maillot Jaune'.", tags: ["Sport", "Radsport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Ringe hat das olympische Symbol?", choices: ["5", "4", "6", "7"], answerIndex: 0, fact: "Sie stehen für die fünf Kontinente.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  
  // Essen & Trinken
  { prompt: "Aus welchem Land kommt Pizza ursprünglich?", choices: ["Italien", "Frankreich", "Griechenland", "Spanien"], answerIndex: 0, fact: "Pizza Margherita wurde in Neapel erfunden.", tags: ["Essen", "Kultur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist Sushi?", choices: ["Japanisches Gericht", "Chinesisches Gericht", "Koreanisches Gericht", "Thailändisches Gericht"], answerIndex: 0, fact: "Sushi besteht aus Reis und rohem Fisch.", tags: ["Essen", "Kultur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Frucht ist eine Beere?", choices: ["Banane", "Erdbeere", "Himbeere", "Kirsche"], answerIndex: 0, fact: "Botanisch gesehen ist die Banane eine Beere.", tags: ["Essen", "Natur"], difficulty: QuizDifficulty.HARD },
  { prompt: "Aus welcher Pflanze wird Schokolade hergestellt?", choices: ["Kakao", "Kaffee", "Vanille", "Zimt"], answerIndex: 0, fact: "Kakaobohnen wachsen am Kakaobaum.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Gewürz ist das teuerste der Welt?", choices: ["Safran", "Vanille", "Kardamom", "Zimt"], answerIndex: 0, fact: "Safran wird aus Krokusblüten gewonnen.", tags: ["Essen"], difficulty: QuizDifficulty.MEDIUM },
  
  // Allgemeinwissen
  { prompt: "Wie viele Stunden hat ein Tag?", choices: ["24", "12", "48", "36"], answerIndex: 0, fact: "Die Erde dreht sich in 24 Stunden einmal um sich selbst.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Minuten hat eine Stunde?", choices: ["60", "50", "100", "30"], answerIndex: 0, fact: "60 Minuten = 3600 Sekunden.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Tage hat ein Jahr?", choices: ["365", "360", "366", "364"], answerIndex: 0, fact: "Schaltjahre haben 366 Tage.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Monate hat ein Jahr?", choices: ["12", "10", "13", "11"], answerIndex: 0, fact: "Januar bis Dezember.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Farbe entsteht wenn man Gelb und Blau mischt?", choices: ["Grün", "Orange", "Lila", "Braun"], answerIndex: 0, fact: "Gelb + Blau = Grün (Farbenlehre).", tags: ["Allgemeinwissen", "Kunst"], difficulty: QuizDifficulty.EASY },
  
  // Mehr Geografie
  { prompt: "Welches ist die Hauptstadt von Frankreich?", choices: ["Paris", "Lyon", "Marseille", "Nizza"], answerIndex: 0, fact: "Paris hat etwa 2,2 Millionen Einwohner.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches ist die Hauptstadt von Italien?", choices: ["Rom", "Mailand", "Venedig", "Florenz"], answerIndex: 0, fact: "Rom wird auch 'Die ewige Stadt' genannt.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches ist die Hauptstadt von Spanien?", choices: ["Madrid", "Barcelona", "Sevilla", "Valencia"], answerIndex: 0, fact: "Madrid liegt im Zentrum Spaniens.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welcher Ozean ist der größte?", choices: ["Pazifik", "Atlantik", "Indischer Ozean", "Arktischer Ozean"], answerIndex: 0, fact: "Der Pazifik bedeckt etwa ein Drittel der Erdoberfläche.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Auf welchem Kontinent liegt Ägypten?", choices: ["Afrika", "Asien", "Europa", "Australien"], answerIndex: 0, fact: "Ägypten liegt im Nordosten Afrikas.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  
  // Mehr Natur
  { prompt: "Welche Farbe haben Smaragde?", choices: ["Grün", "Rot", "Blau", "Gelb"], answerIndex: 0, fact: "Smaragde sind wertvolle Edelsteine.", tags: ["Natur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie heißt der höchste Berg der Welt?", choices: ["Mount Everest", "K2", "Kilimandscharo", "Mont Blanc"], answerIndex: 0, fact: "Der Mount Everest ist 8.849 Meter hoch.", tags: ["Geografie", "Natur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Gas atmen wir ein?", choices: ["Sauerstoff", "Kohlendioxid", "Stickstoff", "Helium"], answerIndex: 0, fact: "Wir atmen Sauerstoff ein und CO2 aus.", tags: ["Wissenschaft", "Biologie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Jahreszeiten gibt es?", choices: ["4", "3", "5", "2"], answerIndex: 0, fact: "Frühling, Sommer, Herbst, Winter.", tags: ["Natur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welcher Baum verliert im Herbst seine Blätter?", choices: ["Laubbaum", "Nadelbaum", "Palme", "Kaktus"], answerIndex: 0, fact: "Nadelbäume behalten ihre Nadeln meist das ganze Jahr.", tags: ["Natur"], difficulty: QuizDifficulty.EASY },

  // Mehr Geschichte
  { prompt: "Wer war der erste Mensch auf dem Mond?", choices: ["Neil Armstrong", "Buzz Aldrin", "Juri Gagarin", "John Glenn"], answerIndex: 0, fact: "Armstrong betrat am 21. Juli 1969 den Mond.", tags: ["Geschichte", "Wissenschaft"], difficulty: QuizDifficulty.EASY },
  { prompt: "In welchem Jahr wurde die Titanic versenkt?", choices: ["1912", "1910", "1914", "1920"], answerIndex: 0, fact: "Die Titanic sank am 15. April 1912.", tags: ["Geschichte"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wer erfand das Telefon?", choices: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"], answerIndex: 0, fact: "Bell erhielt 1876 das Patent.", tags: ["Geschichte", "Wissenschaft"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie hieß der erste deutsche Kaiser?", choices: ["Wilhelm I.", "Friedrich I.", "Otto I.", "Karl der Große"], answerIndex: 0, fact: "Wilhelm I. wurde 1871 Kaiser.", tags: ["Geschichte", "Deutschland"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wann wurde die Bundesrepublik Deutschland gegründet?", choices: ["1949", "1945", "1950", "1948"], answerIndex: 0, fact: "Am 23. Mai 1949 trat das Grundgesetz in Kraft.", tags: ["Geschichte", "Deutschland"], difficulty: QuizDifficulty.MEDIUM },

  // Mehr Tiere
  { prompt: "Welches Tier kann nicht rückwärts laufen?", choices: ["Känguru", "Pferd", "Hund", "Katze"], answerIndex: 0, fact: "Kängurus können nur vorwärts hüpfen.", tags: ["Tiere"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie nennt man eine Gruppe von Löwen?", choices: ["Rudel", "Herde", "Schwarm", "Meute"], answerIndex: 0, fact: "Ein Löwenrudel besteht meist aus verwandten Weibchen.", tags: ["Tiere"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welches Tier schläft im Stehen?", choices: ["Pferd", "Kuh", "Schaf", "Ziege"], answerIndex: 0, fact: "Pferde können im Stehen dösen.", tags: ["Tiere"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Herzen hat ein Oktopus?", choices: ["3", "1", "2", "4"], answerIndex: 0, fact: "Ein Hauptherz und zwei Kiemenherzen.", tags: ["Tiere", "Natur"], difficulty: QuizDifficulty.HARD },
  { prompt: "Welches Tier hat den längsten Hals?", choices: ["Giraffe", "Kamel", "Strauß", "Schwan"], answerIndex: 0, fact: "Der Hals einer Giraffe kann bis zu 2,5 Meter lang sein.", tags: ["Tiere"], difficulty: QuizDifficulty.EASY },

  // Mehr Wissenschaft
  { prompt: "Wie heißt der rote Planet?", choices: ["Mars", "Venus", "Jupiter", "Saturn"], answerIndex: 0, fact: "Mars erscheint rötlich wegen Eisenoxid.", tags: ["Wissenschaft", "Astronomie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist die Hauptzutat von Glas?", choices: ["Sand", "Ton", "Kalk", "Salz"], answerIndex: 0, fact: "Quarzsand wird bei hohen Temperaturen geschmolzen.", tags: ["Wissenschaft"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie schnell ist Licht?", choices: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "100.000 km/s"], answerIndex: 0, fact: "Licht braucht etwa 8 Minuten von der Sonne zur Erde.", tags: ["Wissenschaft", "Physik"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welches Element hat das Symbol 'Au'?", choices: ["Gold", "Silber", "Kupfer", "Eisen"], answerIndex: 0, fact: "Au kommt vom lateinischen 'Aurum'.", tags: ["Wissenschaft", "Chemie"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Wie viele Zähne hat ein erwachsener Mensch?", choices: ["32", "28", "30", "36"], answerIndex: 0, fact: "Inklusive der Weisheitszähne.", tags: ["Wissenschaft", "Biologie"], difficulty: QuizDifficulty.MEDIUM },

  // Mehr Kultur
  { prompt: "Wer schrieb 'Romeo und Julia'?", choices: ["Shakespeare", "Goethe", "Schiller", "Dante"], answerIndex: 0, fact: "William Shakespeare lebte von 1564 bis 1616.", tags: ["Kultur", "Literatur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Noten gibt es in der Musik?", choices: ["7", "5", "8", "12"], answerIndex: 0, fact: "C, D, E, F, G, A, H (bzw. B).", tags: ["Kultur", "Musik"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wer malte 'Die Sternennacht'?", choices: ["Van Gogh", "Monet", "Picasso", "Rembrandt"], answerIndex: 0, fact: "Vincent van Gogh malte es 1889.", tags: ["Kultur", "Kunst"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "In welcher Stadt steht die Freiheitsstatue?", choices: ["New York", "Washington", "Boston", "Philadelphia"], answerIndex: 0, fact: "Sie war ein Geschenk Frankreichs.", tags: ["Kultur", "Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie heißt das berühmteste Werk von Beethoven?", choices: ["9. Sinfonie", "Mondscheinsonate", "Für Elise", "Eroica"], answerIndex: 0, fact: "Die 9. Sinfonie enthält die 'Ode an die Freude'.", tags: ["Kultur", "Musik"], difficulty: QuizDifficulty.MEDIUM },

  // Mehr Sport
  { prompt: "Wie viele Spieler hat eine Handballmannschaft auf dem Feld?", choices: ["7", "6", "8", "5"], answerIndex: 0, fact: "6 Feldspieler und 1 Torwart.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Löcher hat ein Golfplatz normalerweise?", choices: ["18", "9", "27", "36"], answerIndex: 0, fact: "Eine Runde Golf umfasst 18 Löcher.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Sportart wird auf Eis gespielt?", choices: ["Eishockey", "Handball", "Basketball", "Volleyball"], answerIndex: 0, fact: "Eishockey ist besonders in Kanada beliebt.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Punkte gibt es für einen Touchdown im American Football?", choices: ["6", "7", "3", "5"], answerIndex: 0, fact: "Plus 1 oder 2 Punkte für den Extra Point.", tags: ["Sport"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welche Farbe hat der Ball beim Tennis?", choices: ["Gelb", "Weiß", "Grün", "Orange"], answerIndex: 0, fact: "Früher waren Tennisbälle weiß.", tags: ["Sport"], difficulty: QuizDifficulty.EASY },

  // Mehr Essen
  { prompt: "Aus welchem Land kommt Sauerkraut?", choices: ["Deutschland", "Frankreich", "Polen", "Russland"], answerIndex: 0, fact: "Sauerkraut ist fermentierter Weißkohl.", tags: ["Essen", "Deutschland"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist Tofu?", choices: ["Sojaprodukt", "Käse", "Fleisch", "Gemüse"], answerIndex: 0, fact: "Tofu wird aus Sojabohnen hergestellt.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Farbe hat eine reife Banane?", choices: ["Gelb", "Grün", "Braun", "Rot"], answerIndex: 0, fact: "Unreife Bananen sind grün.", tags: ["Essen", "Natur"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist Pasta?", choices: ["Nudeln", "Reis", "Brot", "Kartoffeln"], answerIndex: 0, fact: "Pasta ist das italienische Wort für Nudeln.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Aus welcher Frucht wird Wein gemacht?", choices: ["Trauben", "Äpfel", "Birnen", "Kirschen"], answerIndex: 0, fact: "Weintrauben werden zu Most gepresst und vergoren.", tags: ["Essen"], difficulty: QuizDifficulty.EASY },

  // Mehr Allgemeinwissen
  { prompt: "Wie viele Sekunden hat eine Minute?", choices: ["60", "50", "100", "30"], answerIndex: 0, fact: "60 Sekunden = 1 Minute.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Farbe hat ein Stoppschild?", choices: ["Rot", "Gelb", "Blau", "Grün"], answerIndex: 0, fact: "Rot signalisiert Gefahr und Stopp.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Finger hat eine Hand?", choices: ["5", "4", "6", "10"], answerIndex: 0, fact: "Daumen, Zeigefinger, Mittelfinger, Ringfinger, kleiner Finger.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welche Farbe entsteht wenn man Rot und Gelb mischt?", choices: ["Orange", "Grün", "Lila", "Braun"], answerIndex: 0, fact: "Rot + Gelb = Orange.", tags: ["Allgemeinwissen", "Kunst"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wie viele Wochen hat ein Jahr?", choices: ["52", "50", "48", "54"], answerIndex: 0, fact: "Genau genommen 52 Wochen und 1 Tag.", tags: ["Allgemeinwissen"], difficulty: QuizDifficulty.EASY },

  // Technologie
  { prompt: "Was bedeutet WWW?", choices: ["World Wide Web", "World Wide World", "Web Wide World", "World Web Wide"], answerIndex: 0, fact: "Das WWW wurde 1989 von Tim Berners-Lee erfunden.", tags: ["Technologie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Wer gründete Microsoft?", choices: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Elon Musk"], answerIndex: 0, fact: "Bill Gates gründete Microsoft 1975 mit Paul Allen.", tags: ["Technologie", "Geschichte"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist ein Byte?", choices: ["8 Bit", "4 Bit", "16 Bit", "2 Bit"], answerIndex: 0, fact: "Ein Byte kann 256 verschiedene Werte darstellen.", tags: ["Technologie"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welches Unternehmen stellt das iPhone her?", choices: ["Apple", "Samsung", "Nokia", "Sony"], answerIndex: 0, fact: "Das erste iPhone kam 2007 auf den Markt.", tags: ["Technologie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Was ist ein Virus im Computer?", choices: ["Schadsoftware", "Hardware", "Browser", "Betriebssystem"], answerIndex: 0, fact: "Computerviren können Daten beschädigen oder stehlen.", tags: ["Technologie"], difficulty: QuizDifficulty.EASY },

  // Mehr Geografie
  { prompt: "Welches ist das bevölkerungsreichste Land der Welt?", choices: ["Indien", "China", "USA", "Indonesien"], answerIndex: 0, fact: "Indien hat seit 2023 mehr Einwohner als China.", tags: ["Geografie"], difficulty: QuizDifficulty.MEDIUM },
  { prompt: "Welcher Fluss fließt durch Paris?", choices: ["Seine", "Rhein", "Donau", "Loire"], answerIndex: 0, fact: "Die Seine ist 777 km lang.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches ist die Hauptstadt von England?", choices: ["London", "Manchester", "Liverpool", "Birmingham"], answerIndex: 0, fact: "London hat über 9 Millionen Einwohner.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Auf welchem Kontinent liegt Brasilien?", choices: ["Südamerika", "Afrika", "Asien", "Europa"], answerIndex: 0, fact: "Brasilien ist das größte Land Südamerikas.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
  { prompt: "Welches Land hat die Form eines Stiefels?", choices: ["Italien", "Griechenland", "Spanien", "Portugal"], answerIndex: 0, fact: "Italien ragt ins Mittelmeer hinein.", tags: ["Geografie"], difficulty: QuizDifficulty.EASY },
];

async function main() {
  console.log('📥 Adding 100 new general knowledge questions...');

  let added = 0;
  let skipped = 0;

  // Get existing questions
  const existing = await prisma.quizQuestion.findMany();
  const existingPrompts = new Set(existing.map(q => q.prompt));

  for (const q of newQuestions) {
    if (existingPrompts.has(q.prompt)) {
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
    } catch (error) {
      console.error(`Error adding question: ${q.prompt}`, error);
    }
  }

  console.log(`✅ Added ${added} new questions`);
  console.log(`⏭️  Skipped ${skipped} questions (duplicates)`);
  console.log(`📊 Total questions in database: ${existing.length + added}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

