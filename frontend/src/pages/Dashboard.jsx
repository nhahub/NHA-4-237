import { useEffect, useState } from "react";
import DocumentsChart from "../components/dashboard/DocumentsChart";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatCard from "../components/dashboard/StatCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import RecentActivityCard from "../components/dashboard/RecentActivityCard";
import WeakTopicsCard from "../components/dashboard/WeakTopicsCard";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    documents: 0,
    history: 0,
    accuracy: 0,
    study_hours: 0,
    weak_topics: []
  });

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setDashboard(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <WelcomeCard />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Uploaded Documents"
          value={dashboard.documents}
          icon="📄"
          color="text-blue-600"
        />

        <StatCard
          title="Activities"
          value={dashboard.history}
          icon="📋"
          color="text-emerald-600"
        />

        <StatCard
          title="Accuracy"
          value={`${dashboard.accuracy}%`}
          icon="🎯"
          color="text-orange-500"
        />

        <StatCard
          title="Study Hours"
          value={dashboard.study_hours}
          icon="⏱"
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard progress={dashboard.accuracy} />
        <RecentActivityCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeakTopicsCard topics={dashboard.weak_topics} />
        <QuickActionsCard />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DocumentsChart dashboard={dashboard} />
      </div>
    </div>
  );
}

export default Dashboard;