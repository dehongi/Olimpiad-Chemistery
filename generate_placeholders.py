import os

def generate_placeholders():
    output_dir = 'contents/problems'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    years_data = {
        1388: 60, 1389: 60, 1390: 35, 1391: 50, 1392: 60,
        1393: 40, 1394: 40, 1395: 40, 1396: 40, 1397: 40,
        1398: 50, 1399: 25, 1400: 40, 1402: 40
    }
    
    total_created = 0
    total_skipped = 0
    
    for year, count in years_data.items():
        print(f"Processing year {year} ({count} problems)...")
        for q in range(1, count + 1):
            filename = f"{year}-problem-{q:02d}.md"
            filepath = os.path.join(output_dir, filename)
            
            if os.path.exists(filepath):
                # print(f"Skipping existing file: {filename}")
                total_skipped += 1
                continue
                
            file_content = f"""---
title: سوال {q} المپیاد شیمی مرحله اول {year}
year: {year}
---
# سوال {q} المپیاد شیمی مرحله اول {year}

::: details مشاهده پاسخ
پاسخ این سوال هنوز وارد نشده است.
:::
"""
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(file_content)
            total_created += 1
            
    print(f"\nDone.")
    print(f"Total files created: {total_created}")
    print(f"Total files skipped (already existed): {total_skipped}")

if __name__ == "__main__":
    generate_placeholders()
