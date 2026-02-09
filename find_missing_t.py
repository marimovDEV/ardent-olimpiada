import os
import re

def find_missing_t(src_dir):
    # Regex to find t(...) calls
    t_regex = re.compile(r"\bt\s*\(")
    # Regex to find useTranslation import or call
    use_trans_regex = re.compile(r"useTranslation|i18n\.t")
    
    missing_files = []
    
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    if t_regex.search(content) and not use_trans_regex.search(content):
                        # Double check if it's not just part of a longer name like "start(...)"
                        # but \bt\s*\( should handle that.
                        missing_files.append(path)
                        
    return missing_files

if __name__ == "__main__":
    src = "/Users/ogabek/Documents/projects/ardent olimpiada/frontend/src"
    missing = find_missing_t(src)
    for m in missing:
        print(m)
