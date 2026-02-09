import json

try:
    with open('frontend/src/locales/uz.json', 'r') as f:
        data = json.load(f)
    
    print("Loaded uz.json")
    if 'admin' in data:
        print("Found 'admin' key")
        admin = data['admin']
        if 'curriculum' in admin:
            print("Found 'curriculum' key inside 'admin'")
            curr = admin['curriculum']
            print(f"Title: {curr.get('title', 'MISSING')}")
            print(f"AddModule: {curr.get('addModule', 'MISSING')}")
        else:
            print("'curriculum' key NOT found inside 'admin'")
            print("Keys inside admin:", list(admin.keys())[:10])
    else:
        print("'admin' key NOT found in root")

except Exception as e:
    print(f"Error: {e}")
