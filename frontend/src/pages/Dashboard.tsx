import DailyGoals from "@/components/dashboard/DailyGoals";
import GamificationStats from "@/components/dashboard/GamificationStats";
import SmartCourseList from "@/components/dashboard/SmartCourseList";
import SmartOlympiadCard from "@/components/dashboard/SmartOlympiadCard";
import AnalyticsResults from "@/components/dashboard/AnalyticsResults";

const Dashboard = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">

      {/* Header Grid: Gamification & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Stats - 5 columns */}
        <div className="lg:col-span-5">
          <GamificationStats />
        </div>
        {/* Daily Focus - 7 columns */}
        <div className="lg:col-span-7">
          <DailyGoals />
        </div>
      </div>

      {/* Action Grid: Courses & Olympiads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Smart Course List - 7 columns */}
        <div className="lg:col-span-7">
          <SmartCourseList />
        </div>
        {/* Urgent Olympiad - 5 columns */}
        <div className="lg:col-span-5">
          <SmartOlympiadCard />
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsResults />

    </div>
  );
};

export default Dashboard;
