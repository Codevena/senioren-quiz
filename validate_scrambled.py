#!/usr/bin/env python3
"""
Validate all Buchstabensalat questions for:
1. Letter count consistency (scrambled vs answer)
2. Valid anagrams (same letters, just rearranged)
3. Proper tagging with "Buchstabensalat"
"""

import json
from collections import Counter

def extract_scrambled_letters(prompt):
    """Extract scrambled letters from prompt"""
    parts = prompt.split(': ')
    if len(parts) == 2:
        return parts[1].strip()
    return None

def is_valid_anagram(scrambled, answer):
    """Check if scrambled is a valid anagram of answer"""
    return Counter(scrambled.upper()) == Counter(answer.upper())

def validate_scrambled_questions(filename):
    """Validate all scrambled questions"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    issues = []
    scrambled_questions = [q for q in questions if q.get('type') == 'scrambled']
    
    print(f"Total scrambled questions: {len(scrambled_questions)}\n")
    
    for question in scrambled_questions:
        qid = question['id']
        answer = question.get('answer', '')
        scrambled = extract_scrambled_letters(question.get('prompt', ''))
        
        if not scrambled:
            issues.append(f"{qid}: Could not extract scrambled letters from prompt")
            continue
        
        # Check letter count
        if len(scrambled) != len(answer):
            issues.append(
                f"{qid}: Letter count mismatch - "
                f"Scrambled '{scrambled}' ({len(scrambled)} letters) vs "
                f"Answer '{answer}' ({len(answer)} letters)"
            )
        
        # Check if valid anagram
        elif not is_valid_anagram(scrambled, answer):
            issues.append(
                f"{qid}: Invalid anagram - "
                f"Scrambled '{scrambled}' is not an anagram of '{answer}'"
            )
        
        # Check for Buchstabensalat tag
        if 'Buchstabensalat' not in question.get('tags', []):
            issues.append(f"{qid}: Missing 'Buchstabensalat' tag")
    
    # Print results
    if issues:
        print("ISSUES FOUND:")
        print("=" * 80)
        for issue in issues:
            print(f"  ❌ {issue}")
        print(f"\nTotal issues: {len(issues)}")
    else:
        print("✅ All scrambled questions are valid!")
        print("  - All letter counts match")
        print("  - All anagrams are correct")
        print("  - All questions have 'Buchstabensalat' tag")
    
    return issues

if __name__ == '__main__':
    issues = validate_scrambled_questions('lib/questions-data.json')
    exit(0 if not issues else 1)

