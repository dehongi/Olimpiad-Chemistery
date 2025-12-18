import re

def debug_matches():
    with open('contents/problems/extracted_1403.txt', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Unicode cleanup
    cleaned = re.sub(r'[\u200b-\u200f\u202a-\u202e\u2066-\u2069]', '', content)
    
    # Find all pattern matches
    matches = re.finditer(r'-(\d+)', cleaned)
    
    print("Matches found:")
    for match in matches:
        start = max(0, match.start() - 10)
        end = min(len(cleaned), match.end() + 20)
        context = cleaned[start:end].replace('\n', '\\n')
        print(f"Match '{match.group(0)}' at {match.start()}: context='{context}'")

if __name__ == "__main__":
    debug_matches()
