import re
import os
import argparse

def parse_and_create_files():
    parser = argparse.ArgumentParser(description='Extract problems from text file.')
    parser.add_argument('input_file', help='Path to input text file')
    parser.add_argument('year', type=int, help='Year of the olympiad (e.g. 1403)')
    parser.add_argument('--output_dir', default='contents/problems', help='Output directory')
    
    args = parser.parse_args()
    
    input_file = args.input_file
    target_year = args.year
    output_dir = args.output_dir
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Processing {input_file} for year {target_year}...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean unicode control characters
    content = re.sub(r'[\u200b-\u200f\u202a-\u202e\u2066-\u2069]', '', content)
    
    # Logic for cutoff: 
    # Attempt to finding starting point.
    cutoff_index = 0
    markers = [
        r'مرحله اول.*دوره', 
        r'آدرس سایت اینترنتی',
        r'صفحه\s*1\s*از' 
    ]
    
    for m in markers:
        match = re.search(m, content)
        if match:
            cutoff_index = match.start()
            print(f"Found cutoff marker '{m}' at {cutoff_index}")
            break
            
    if cutoff_index == 0:
        print("Warning: No cutoff marker found, starting from beginning.")
        
    # Find all matches of numbers
    # We use a pattern that finds dash-number.
    # Updated to allow optional space between dash and number: - 1 or -1
    matches = list(re.finditer(r'(?:^|\s)-\s*(\d+)', content))
    
    questions = {}
    next_expected = 1
    current_start_index = -1
    
    for match in matches:
        if match.start() < cutoff_index:
            continue
            
        val = int(match.group(1))
        
        if val == next_expected:
            # print(f"Found start of Question {val} at {match.start()}")
            
            # If we were processing a previous question, save it
            if next_expected > 1:
                prev_q = next_expected - 1
                # Text is from current_start_index to match.start()
                # Use match.start() to exclude the "-N" of the new question 
                # but we included "-Prev" in the start index logic?
                # Actually, strictly content is between matches.
                # However, the "-N" itself should be removed from the text?
                # Typically titles are "Question N". The text body shouldn't start with "-N".
                # My logic: Q text = content[current_start_index : match.start()]
                
                # Wait, current_start_index should be AFTER the "-N" of the question.
                
                q_text = content[current_start_index : match.start()].strip()
                questions[prev_q] = q_text
            
            # Update start index for THIS question
            # It starts after this match.
            current_start_index = match.end()
            next_expected += 1
            
        elif val == next_expected - 1:
            # Duplicate or same number appearing?
            # Ignore
            pass
        else:
            # Out of order number (e.g. -3 inside text of Q40). Ignore.
            pass
            
    # Save the last question (40)
    if next_expected > 1:
        last_q = next_expected - 1
        # Extract until end or some end marker.
        # Just take until end of string for now, or maybe look for "صفحه" if end?
        # Ideally just take it all.
        q_text = content[current_start_index:].strip()
        questions[last_q] = q_text
        print(f"Saved Question {last_q}")

    print(f"Total extracted: {len(questions)}")
    
    for q_num, text in questions.items():
        filename = f"{target_year}-problem-{q_num:02d}.md"
        filepath = os.path.join(output_dir, filename)
        
        # Clean up text
        # Remove page headers appearing in text? "صفحه X از 10"
        text = re.sub(r'صفحه\s*\d+\s*از\s*\d+', '', text)
        text = re.sub(r'کد سواالت.*', '', text)
        text = re.sub(r'سی و .* دوره.*140\d', '', text)
        
        file_content = f"""---
title: سوال {q_num} المپیاد شیمی مرحله اول {target_year}
year: {target_year}
---
# سوال {q_num} المپیاد شیمی مرحله اول {target_year}

{text}

::: details مشاهده پاسخ
پاسخ این سوال هنوز وارد نشده است.
:::
"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(file_content)

if __name__ == "__main__":
    parse_and_create_files()
