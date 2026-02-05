import os

import_line = 'import { API_URL as API_BASE } from "@/services/api";'

files = [
    "frontend/src/pages/OlympiadResultPage.tsx",
    "frontend/src/pages/teacher/TeacherLoginPage.tsx",
    "frontend/src/pages/AuthPage.tsx",
    "frontend/src/pages/ResultsPage.tsx",
    "frontend/src/pages/CoursesPage.tsx",
    "frontend/src/pages/PublicCoursesPage.tsx",
    "frontend/src/pages/OlympiadLeaderboardPage.tsx",
    "frontend/src/pages/OlympiadsPage.tsx",
    "frontend/src/pages/admin/AdminLoginPage.tsx",
    "frontend/src/pages/OlympiadTestPage.tsx",
    "frontend/src/pages/OlympiadDetailPage.tsx",
    "frontend/src/components/DashboardNavbar.tsx",
    "frontend/src/components/dashboard/StudentProfileCard.tsx",
    "frontend/src/components/dashboard/StreakStats.tsx",
    "frontend/src/components/dashboard/AnalyticsResults.tsx",
    "frontend/src/components/dashboard/GamificationStats.tsx",
    "frontend/src/components/dashboard/DailyGoals.tsx",
    "frontend/src/components/dashboard/SmartCourseList.tsx"
]

base_dir = "/Users/ogabek/Documents/projects/ardent olimpiada/"

for rel_path in files:
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Remove all occurrences of the import_line
    new_lines = [line for line in lines if import_line not in line]
    
    # Add it back at the top (after the first few lines of imports)
    new_lines.insert(0, import_line + "\n")
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Fixed: {rel_path}")
