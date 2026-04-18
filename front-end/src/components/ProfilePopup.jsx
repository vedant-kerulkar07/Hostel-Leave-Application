// src/components/ProfilePopup.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";

const ProfilePopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${getEnv("VITE_API_URL")}/user/complete-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomNumber,
            phoneNumber,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message);
      }

      dispatch(setUser(data));
      showToast("success", "Profile updated successfully");
      onClose(); // ✅ close popup after success
    } catch (err) {
      showToast("error", err.message || "Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-lg font-semibold mb-4">Complete Your Profile</h2>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm">Name</label>
          <input
            value={user.name || ""}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Room Number */}
        <div className="mb-3">
          <label className="block text-sm">Room Number</label>
          <input
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="block text-sm">Phone Number</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePopup;
