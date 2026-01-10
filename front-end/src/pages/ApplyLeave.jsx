// src/pages/ApplyLeaveForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCheck } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";

// Zod schema
const leaveSchema = z
  .object({
    studentId: z.string().min(1, "Student ID is required"),
    name: z.string().min(1, "Name is required"),
    roomNumber: z.string().min(1, "Room number is required"),
    leaveType: z.string().min(1, "Please select a leave type"),
    destination: z.string().optional(),
    contactNumber: z.string().min(10, "Contact number is required"),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
    reason: z.string().min(1, "Please provide a reason"),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    {
      message: "End date must be same or after start date",
      path: ["endDate"],
    }
  );

export default function ApplyLeaveForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // ✅ Fetch logged-in user data
  const { data: userData } = useFetch(
    `${getEnv("VITE_API_URL")}/user/get-user/${user?.user?._id}`,
    { method: "get", credentials: "include" }
  );

  const form = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      studentId: "",
      name: "",
      roomNumber: "",
      leaveType: "",
      destination: "",
      contactNumber: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  // ✅ Pre-fill studentId & name once data is fetched
  useEffect(() => {
    if (userData?.success) {
      form.setValue("studentId", userData.user._id);
      form.setValue("name", userData.user.name);
      form.setValue("roomNumber", userData.user.roomNumber || "");
      form.setValue("contactNumber", userData.user.phone || "");
    }
  }, [userData, form]);

  const onSubmit = async (values) => {
    try {
      const res = await fetch(`${getEnv("VITE_API_URL")}/leaves/apply`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok)
        return showToast("error", data.message || "Failed to apply leave");

      showToast("success", data.message || "Leave applied successfully");
      form.reset();
      navigate("/dashboard");
    } catch (err) {
      showToast("error", err.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-teal-700">Apply for a Leave</h1>
          <p className="text-sm text-gray-500">
            Your leave application in one step
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student ID (Auto-filled, read-only) */}
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Student ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="mt-2 block w-full rounded-md px-4 py-3 bg-gray-100 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Name (Auto-filled, read-only) */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="mt-2 block w-full rounded-md px-4 py-3 bg-gray-100 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Room Number */}
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Room Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. B-203"
                          {...field}
                          className="mt-2 block w-full rounded-md px-4 py-3 bg-sky-50 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Leave Type */}
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Leave Type
                      </FormLabel>
                      <FormControl className="mt-2">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full rounded-md px-4 py-3 bg-sky-50 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200">
                            <SelectValue placeholder="Choose leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                            <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                            <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                            <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                            <SelectItem value="Family Function Leave">Family Function Leave</SelectItem>
                            <SelectItem value="Festival Leave">Festival Leave</SelectItem>
                            <SelectItem value="Examination Leave">Examination Leave</SelectItem>
                            <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                            <SelectItem value="Official Leave">Official Leave</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Destination */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Destination (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Where you are going"
                          {...field}
                          className="mt-2 block w-full rounded-md px-4 py-3 bg-sky-50 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Contact Number */}
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...field}
                          className="mt-2 block w-full rounded-md px-4 py-3 bg-sky-50 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200"
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <div className="relative mt-2">
                          <Input
                            type="date"
                            {...field}
                            className="block w-full rounded-md px-4 py-3 bg-sky-50 outline-none border focus:ring-2 focus:ring-teal-200"
                          />
                          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600">
                        End Date
                      </FormLabel>
                      <FormControl>
                        <div className="relative mt-2">
                          <Input
                            type="date"
                            {...field}
                            className="block w-full rounded-md px-4 py-3 bg-sky-50 outline-none border focus:ring-2 focus:ring-teal-200"
                          />
                          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage className="mt-1 text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-gray-600">
                      Reason for Leave
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain briefly..."
                        rows={5}
                        {...field}
                        className="mt-2 block w-full rounded-md px-4 py-3 bg-sky-50 placeholder-gray-400 outline-none border focus:ring-2 focus:ring-teal-200"
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-xs text-red-600" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-md text-sm font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FaCheck />
                {loading ? "Loading..." : "Apply for Leave"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}