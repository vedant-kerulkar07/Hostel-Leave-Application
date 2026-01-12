import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { getEnv } from "@/helpers/getEnv";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, bg, textWhite = false }) => (
   <div
    className={`rounded-lg p-5 flex justify-between items-center cursor-pointer ${
      bg ? bg : "bg-white"
    } shadow-sm hover:shadow-md transition`}
  >
    <div className={`flex items-center gap-4 ${textWhite ? "text-white" : "text-gray-900"}`}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20">
        <Icon className={`w-6 h-6 ${textWhite ? "text-white" : "text-gray-700"}`} />
      </div>
      <div>
        <p className={`text-xs font-medium leading-snug ${textWhite ? "text-white/90" : "text-gray-600"}`}>
          {title}
        </p>
        <p className={`font-bold text-xl ${textWhite ? "text-white" : "text-gray-900"}`}>{value}</p>
      </div>
    </div>
    <ChevronRight className={`w-6 h-6 ${textWhite ? "text-white" : "text-gray-400"}`} />
  </div>
);

const ActivityItem = ({ user, type, status, time }) => {
  const statusColors = {
    Approved: "bg-green-500 text-white",
    Pending: "bg-yellow-400 text-white",
    Rejected: "bg-red-500 text-white",
  };

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-none">
      <div className="flex items-center gap-4">
        {/* Placeholder avatar circle with initials, can replace with real avatar */}
        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-semibold select-none">
          {user.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{user}</p>
          <p className="text-xs text-gray-500">{type}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`py-1 px-3 rounded-full font-semibold text-xs ${statusColors[status]}`}
        >
          {status}
        </span>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  );
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInSeconds / 86400);
  return `${diffInDays}d ago`;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 120,
    approved: 95,
    pending: 15,
    rejected: 10,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchAdminSummary = async () => {
      try {
        const response = await fetch(
          `${getEnv("VITE_API_URL")}/leaves/admin-summary`,
          { credentials: "include" }
        );
        if (response.status === 401 || response.status === 403) return;
        const data = await response.json();
        if (response.ok) {
          setStats(data.stats);
          setRecent(data.recent);
        }
      } catch (error) {
        console.error("Failed to fetch admin summary:", error);
        setRecent([
          {
            _id: "1",
            studentName: "Ethan Carter",
            leaveType: "Vacation Request",
            status: "Pending",
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          },
          {
            _id: "2",
            studentName: "Ethan Carter",
            leaveType: "Vacation Request",
            status: "Approved",
            createdAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
          },
          {
            _id: "3",
            studentName: "Ethan Carter",
            leaveType: "Vacation Request",
            status: "Rejected",
            createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
          },
        ]);
      }
    };
    fetchAdminSummary();
  }, []);

  return (
    <div className="  bg-[#F7F8FC] p-6">
      <div className="flex-1 w-full flex flex-col overflow-hidden px-8 ">
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1D3748] leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your student’s leave summary at a glance...
            </p>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Leaves (month)"
              value={stats.total}
              icon={CalendarDays}
              bg="bg-white"
              textWhite={false}
            />
               <StatCard
              title="Leaves Approved"
              value={stats.approved}
              icon={CalendarDays}
              bg="bg-green-500"
              textWhite={true}

            />
            <StatCard
              title="Pending Leaves"
              value={stats.pending}
              icon={CalendarDays}
              bg="bg-yellow-400"
              textWhite={true}
            />
            <StatCard
              title="Rejected Leaves"
              value={stats.rejected}
              icon={CalendarDays}
              bg="bg-red-500"
              textWhite={true}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg text-[#1D3748]">
                Recent Activity
              </h2>
              <div className="flex gap-3">
                <button className="bg-green-500 text-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold shadow hover:bg-green-600 transition">
                  <CheckCircle className="w-4 h-4" /> Approve All
                </button>
                <button className="bg-red-500 text-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold shadow hover:bg-red-600 transition">
                  <XCircle className="w-4 h-4" /> Reject All
                </button>
              </div>
            </div>

            <div>
              {recent?.length > 0 ? (
                recent.map((leave) => (
                  <ActivityItem
                    key={leave._id}
                    user={leave.studentName || "Student"}
                    type={leave.leaveType}
                    status={leave.status}
                    time={formatRelativeTime(leave.createdAt)}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-10">
                  No leave activity yet.
                </p>
              )}
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
