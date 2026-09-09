import { Question } from '../types';

/**
 * Strict Science Exclusion Filter
 * Strictly bars any natural/physical science concepts (physics, chemistry, biology,
 * botany, zoology, astronomy, physiology, cellular biology, thermodynamics, etc.)
 * Ensuring 100% focus on pure Logic, IQ, Algorithmic Thinking, and Cognitive Problem Solving.
 */

export const BANNED_SCIENCE_TERMS: string[] = [
  // Biological & Life Sciences
  'photosynthesis',
  'chlorophyll',
  'cellular',
  'respiration',
  'oxygen gas',
  'nitrogen gas',
  'carbon dioxide',
  'mitochondria',
  'organism',
  'bacteria',
  'virus',
  'fungi',
  'plant',
  'plants',
  'animal',
  'animals',
  'mammal',
  'mammals',
  'reptile',
  'reptiles',
  'amphibian',
  'dna',
  'rna',
  'gene',
  'genetic',
  'enzyme',
  'digestive',
  'circulatory',
  'botany',
  'zoology',
  'biology',
  'biological',
  'ecosystem',
  'photosynthetic',
  
  // Physical Sciences & Chemistry
  'physics',
  'chemistry',
  'chemical',
  'atom',
  'atoms',
  'atomic',
  'molecule',
  'molecules',
  'molecular',
  'electron',
  'proton',
  'neutron',
  'gravity',
  'gravitational',
  'velocity',
  'acceleration',
  'friction',
  'thermodynamics',
  'barometer',
  'thermometer',
  'allotrope',
  'allotropes',
  'graphene',
  'graphite',
  'diamond',
  'brass alloy',
  'acid',
  'base',
  'alkaline',
  'newton',
  'joule',
  'watt',
  'amperes',
  'voltage',
  'astronomy',
  'planet',
  'galaxy',
  'telescope',
  'microscope',

  // Urdu Terms
  'فوٹوسنتھیسز',
  'کلوروفل',
  'آکسیجن',
  'نائٹروجن',
  'کاربن',
  'تھرمامیٹر',
  'بیرومیٹر',
  'جوہری',
  'ممالیہ',
  'ریپٹائل',
  'کشش ثقل',
  'گریفائٹ',
  'سائنسی تجربہ',
  'طبیعیات',
  'حیاتیات',
  'کیمیا'
];

/**
 * Checks if a question or text contains any forbidden science-related content.
 */
export function isScienceRelated(q: Partial<Question>): boolean {
  if (!q) return false;

  // Category check
  const cat = (q.category || '').toLowerCase();
  const sub = (q.subcategory || '').toLowerCase();
  if (
    cat.includes('science') ||
    cat.includes('physics') ||
    cat.includes('chemistry') ||
    cat.includes('biology') ||
    sub.includes('science') ||
    sub.includes('physics') ||
    sub.includes('chemistry') ||
    sub.includes('biology')
  ) {
    return true;
  }

  // Text content check across all linguistic representations
  const haystack = [
    q.text || '',
    q.textUrdu || '',
    q.textRoman || '',
    q.hint || '',
    q.hintUrdu || '',
    q.hintRoman || '',
    q.explanation || '',
    q.explanationUrdu || '',
    q.explanationRoman || '',
    ...(q.options || []).map((o) => `${o.text} ${o.textUrdu || ''} ${o.textRoman || ''}`),
  ]
    .join(' ')
    .toLowerCase();

  return BANNED_SCIENCE_TERMS.some((term) => {
    const lowerTerm = term.toLowerCase();
    // Word boundary check or substring match
    if (lowerTerm.length <= 3) {
      const regex = new RegExp(`\\b${lowerTerm}\\b`, 'i');
      return regex.test(haystack);
    }
    return haystack.includes(lowerTerm);
  });
}

/**
 * Filters an array of questions, strictly discarding any science-related questions.
 */
export function filterOutScienceQuestions(questions: Question[]): Question[] {
  return questions.filter((q) => !isScienceRelated(q));
}
