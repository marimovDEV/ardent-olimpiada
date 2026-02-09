import os
import re

def fix_i18n(src_dir):
    # Entities that are now objects with a .title
    entities = ['users', 'teachers', 'courses', 'olympiads', 'notifications', 'ai', 'supportSection']
    
    # Regex to find t('admin.entity') but NOT t('admin.entity.something')
    # It should match t('admin.users') or t("admin.users") or t(`admin.users`)
    for entity in entities:
        pattern = re.compile(rf"t\s*\(\s*(['\"`])admin\.{entity}\1\s*\)")
        replacement = rf"t('admin.{entity}.title')"
        
        for root, _, files in os.walk(src_dir):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                    path = os.path.join(root, file)
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = pattern.sub(replacement, content)
                    
                    if new_content != content:
                        print(f"Fixed {path} for admin.{entity}")
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)

if __name__ == "__main__":
    src = "/Users/ogabek/Documents/projects/ardent olimpiada/frontend/src"
    fix_i18n(src)
