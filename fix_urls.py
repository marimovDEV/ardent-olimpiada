import os
import re

api_url_import = 'import { API_URL as API_BASE } from "@/services/api";'
pattern = r"const API_BASE = ['\"]http://localhost:8000/api['\"];"

files = [
    "frontend/src/pages/teacher/TeacherLoginPage.tsx",
    "frontend/src/pages/OlympiadResultPage.tsx",
    "frontend/src/pages/CourseDetailPage.tsx",
    "frontend/src/pages/ResultsPage.tsx",
    "frontend/src/components/OlympiadSection.tsx",
    "frontend/src/pages/OlympiadLeaderboardPage.tsx",
    "frontend/src/pages/AuthPage.tsx",
    "frontend/src/pages/admin/AdminLoginPage.tsx",
    "frontend/src/pages/admin/AdminHomeCMSPage.tsx",
    "frontend/src/pages/CoursesPage.tsx",
    "frontend/src/pages/PublicCoursesPage.tsx",
    "frontend/src/pages/OlympiadsPage.tsx",
    "frontend/src/pages/OlympiadDetailPage.tsx",
    "frontend/src/components/TeacherLayout.tsx",
    "frontend/src/components/AIChatWidget.tsx",
    "frontend/src/components/dashboard/AnalyticsResults.tsx",
    "frontend/src/components/dashboard/StreakStats.tsx",
    "frontend/src/components/dashboard/DailyGoals.tsx",
    "frontend/src/components/dashboard/GamificationStats.tsx",
    "frontend/src/components/dashboard/StudentProfileCard.tsx",
    "frontend/src/components/dashboard/SmartCourseList.tsx",
    "frontend/src/pages/OlympiadTestPage.tsx",
    "frontend/src/components/home/TeaserBlock.tsx",
    "frontend/src/components/home/TeachersSection.tsx",
    "frontend/src/components/DashboardNavbar.tsx"
]

base_dir = "/Users/ogabek/Documents/projects/ardent olimpiada/"

for rel_path in files:
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if re.search(pattern, content):
        # Replace the constant definition with the import
        new_content = re.sub(pattern, api_url_import, content)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {rel_path}")
    else:
        # Check if it uses a different pattern or already updated
        if "API_URL" in content and "API_BASE" in content:
             print(f"Already updated or complex: {rel_path}")
        else:
             print(f"Pattern not found in: {rel_path}")
