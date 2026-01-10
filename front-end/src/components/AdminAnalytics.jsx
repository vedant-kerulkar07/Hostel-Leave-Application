import React, { useEffect, useState } from "react";
import { getEnv } from "@/helpers/getEnv";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";

// --- Colors (Teal + Blue palette like in Figma) ---
const COLORS = ["#0f766e", "#0891b2", "#0ea5e9", "#64748b"];
const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    monthlyRequests: [],
    leaveReasons: [],
    topStudents: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `${getEnv("VITE_API_URL")}/leaves/admin-analytics`,
          { credentials: "include" }
        );
        if (response.status === 401 || response.status === 403) return;

        const data = await response.json();
        if (response.ok) {
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  // Transform monthlyRequests into chart format
  const monthlyData = analytics.monthlyRequests.map((count, index) => ({
    month: new Date(0, index).toLocaleString("default", { month: "short" }),
    requests: count,
  }));

  // Transform leave reasons for PieChart
  const reasonsData = analytics.leaveReasons.map((r) => ({
    name: r._id,
    value: r.count,
  }));

  return (
    <div className="bg-slate-50 min-h-screen font-sans pt-16 p-6">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 text-[#1B6A76]">Analytics</h1>
        <p className="text-slate-500 mt-1">Your student's leave history at a glance...</p>
      </div>

      {/* --- Main Grid --- */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* --- Card 1: Monthly Requests --- */}
        <section className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* <CalendarIcon /> */}
              <h2 className="text-xl font-semibold text-slate-700 text-[#1B6A76]">Monthly Requests</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-800">
                {analytics.monthlyRequests.reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm text-slate-500">
                This Year
              </p>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="requests" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="requests" position="top" fill="#64748b" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* --- Card 2: Leave Reasons --- */}
        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            {/* <ClockIcon /> */}
            <h2 className="text-xl font-semibold text-slate-700 text-[#1B6A76]">Leave Reasons</h2>
          </div>
          <div className="mt-4 flex items-center justify-around h-72">
            <div className="w-1/2 h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={reasonsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {reasonsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="w-1/2 flex flex-col gap-4 text-sm">
              {reasonsData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-slate-600">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Card 3: Top Students --- */}
        <section className="lg:col-span-5 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-slate-700 text-[#1B6A76]">Top Students</h2>
          <div className="mt-4 grid grid-cols-[1fr_120px_120px] px-4 pb-2 border-b text-sm font-medium text-slate-500">
            <span>Name</span>
            <span className="text-center">Leave Count</span>
            <span className="text-right">Action</span>
          </div>

          <ul className="mt-2 space-y-1">
            {analytics.topStudents.map((s, index) => (
              <li key={index} className="grid grid-cols-[1fr_120px_120px] items-center py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {s._id.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{s._id.name}</p>
                    <p className="text-sm text-slate-500">{s.leaveTypes}</p>
                  </div>

                </div>
                <div className="text-center font-semibold text-slate-700">
                  {s.leaveCount}
                </div>


                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/admin/student/${s._id.studentId}`)}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                </div>

              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminAnalytics;

