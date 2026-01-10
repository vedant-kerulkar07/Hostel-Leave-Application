// StudentAnalytics.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { getEnv } from "@/helpers/getEnv";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from "recharts";

const COLORS = ["#0f766e", "#0891b2", "#0ea5e9", "#64748b"];

const StudentAnalytics = () => {
  const { studentId } = useParams(); // get from URL
  const [analytics, setAnalytics] = useState({ student: {}, monthlyRequests: [], leaveReasons: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${getEnv("VITE_API_URL")}/leaves/student/${studentId}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    };
    fetchData();
  }, [studentId]);
  const monthlyData = analytics.monthlyRequests.map((count, index) => ({
    month: new Date(0, index).toLocaleString("default", { month: "short" }),
    requests: count,
  }));

  const reasonsData = analytics.leaveReasons.map((r) => ({
    name: r._id,
    value: r.count,
  }));

  return (
    <div className="p-6 pt-16 bg-slate-50 min-h-screen">
      {/* Student Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 text-[#1B6A76]">Student Leave History</h1>
        <p className="text-slate-500 mt-1 pb-4">Your student's leave history at a glance...</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1B6A76]">{analytics.student?.name}</h2>
          <p className="text-slate-500">{analytics.student?.rollNo} | Room {analytics.student?.roomNo}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 space-y-6 md:space-y-0">
        {/* Monthly Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#1B6A76]">Leaves History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#0ea5e9">
                <LabelList dataKey="requests" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Reasons Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#1B6A76]">Leave Reasons</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={reasonsData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {reasonsData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4">
            {reasonsData.map((r, i) => (
              <p key={i} className="flex justify-between text-sm">
                <span>{r.name}</span>
                <span>{r.value}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
