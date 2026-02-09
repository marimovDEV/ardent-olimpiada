import json
import os
import re

def audit_i18n(src_dir, locales_dir):
    # Load locale files
    locales = {}
    for lang in ['uz', 'ru']:
        path = os.path.join(locales_dir, f'{lang}.json')
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                locales[lang] = json.load(f)

    def get_value(data, key):
        parts = key.split('.')
        for part in parts:
            if isinstance(data, dict) and part in data:
                data = data[part]
            else:
                return None
        return data

    # Find all t('...') calls
    # Supports t("key"), t('key'), t(`key`)
    t_regex = re.compile(r"t\s*\(\s*['\"`]([a-zA-Z0-9._-]+)['\"`]")
    
    problems = []
    
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    matches = t_regex.findall(content)
                    for key in matches:
                        for lang, data in locales.items():
                            value = get_value(data, key)
                            if value is not None and isinstance(value, dict):
                                problems.append({
                                    "file": path,
                                    "key": key,
                                    "lang": lang,
                                    "type": "OBJECT"
                                })
                            elif value is None:
                                # Optional: check for missing keys
                                # problems.append({"file": path, "key": key, "lang": lang, "type": "MISSING"})
                                pass

    return problems

if __name__ == "__main__":
    src = "/Users/ogabek/Documents/projects/ardent olimpiada/frontend/src"
    locales = "/Users/ogabek/Documents/projects/ardent olimpiada/frontend/src/locales"
    
    results = audit_i18n(src, locales)
    
    if not results:
        print("No i18n problems found.")
    else:
        print(f"Found {len(results)} potential i18n problems:")
        for p in results:
            print(f"[{p['lang']}] {p['key']} is an {p['type']} in {p['file']}")
