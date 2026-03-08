import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as teacherApi from "@/api/teacher.api";
import {
  Bell,
  Send,
  MailOpen,
  Mail,
  Users,
} from "lucide-react";

/* ---------------------------------------------------- */

export const TeacherMessage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"INBOX" | "SEND">("INBOX");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    classId: "",
    section: "",
  });

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await teacherApi.pollMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH BATCHES ---------------- */
  const fetchClasses = async () => {
    const res = await teacherApi.getAssignedStudents();
    setClasses(
      res.data.map((c: any) => ({
        value: c.batchId,
        label: c.batchName,
        department: c.department,
      }))
    );
  };

  useEffect(() => {
    fetchNotifications();
    fetchClasses();
  }, []);

  /* ---------------- MARK AS READ ---------------- */
  const markAsRead = async (statusId: string) => {
    await teacherApi.markNotificationAsRead(statusId);
    fetchNotifications();
  };

  /* ---------------- SEND NOTIFICATION ---------------- */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.message || !form.classId) {
      alert("Title, message and batch are required");
      return;
    }

    try {
      await teacherApi.sendNotificationToStudents({
        title: form.title,
        message: form.message,
        batchId: form.classId,
      });
      alert("Notification sent successfully");
      setForm({ title: "", message: "", classId: "", section: "" });
      setActiveTab("INBOX");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send notification");
    }
  };

  /* ---------------------------------------------------- */

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-violet-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Bell size={28} className="text-indigo-600" />
        <h1 className="text-3xl font-bold text-indigo-700">
          Notifications
        </h1>
      </div>

      {/* TABS */}
      <div className="flex gap-3">
        <Button
          variant={activeTab === "INBOX" ? "primary" : "secondary"}
          onClick={() => setActiveTab("INBOX")}
        >
          Inbox
        </Button>
        <Button
          variant={activeTab === "SEND" ? "primary" : "secondary"}
          onClick={() => setActiveTab("SEND")}
        >
          Send to Students
        </Button>
      </div>

      {/* ================= INBOX ================= */}
      {activeTab === "INBOX" && (
        <>
          {loading ? (
            <LoadingSpinner />
          ) : notifications.length === 0 ? (
            <Card className="text-center py-12 text-neutral-500">
              No notifications yet
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <Card
                  key={n._id}
                  className={`border-l-4 ${
                    n.isRead
                      ? "border-neutral-300"
                      : "border-indigo-500"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      {n.isRead ? (
                        <MailOpen className="text-neutral-400" />
                      ) : (
                        <Mail className="text-indigo-600" />
                      )}

                      <div>
                        <h3 className="font-semibold">
                          {n.notification.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          {n.notification.message}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {new Date(
                            n.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {!n.isRead && (
                      <Button
                        variant="secondary"
                        onClick={() => markAsRead(n._id)}
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= SEND ================= */}
      {activeTab === "SEND" && (
        <Card className="max-w-2xl">
          <form onSubmit={handleSend} className="space-y-6">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
              />
            </div>

            <Select
              label="Batch"
              value={form.classId}
              onChange={(e) =>
                setForm({ ...form, classId: e.target.value })
              }
              options={classes}
              required
            />

            <p className="text-sm text-neutral-500 -mt-2">
              Notification will be sent to all students in the selected batch
            </p>

            <Button type="submit" className="w-full flex gap-2">
              <Send size={16} />
              Send Notification
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
