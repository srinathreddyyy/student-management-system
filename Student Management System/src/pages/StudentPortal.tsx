import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/StatCard";
import { User, Calendar, BookOpen, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

interface StudentRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  section: string;
  gpa: number;
  status: string;
  enrollment_date: string;
  date_of_birth: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  period: string | null;
  subject: string | null;
}

const StudentPortal = () => {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (studentData) {
        setStudent(studentData);
        const { data: attData } = await supabase
          .from("attendance")
          .select("id, date, status, period, subject")
          .eq("student_id", studentData.id)
          .order("date", { ascending: false })
          .limit(30);
        if (attData) setAttendance(attData);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const totalAttendance = attendance.length;
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {profile?.first_name || "Student"}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Your student portal overview</p>
      </div>

      {student ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Grade" value={`${student.grade} - ${student.section}`} icon={BookOpen} variant="primary" />
            <StatCard title="GPA" value={student.gpa} icon={TrendingUp} variant="accent" />
            <StatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={Calendar} variant="warning" />
            <StatCard title="Status" value={student.status} icon={User} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card shadow-card">
              <div className="p-5 border-b">
                <h2 className="text-base font-semibold">Profile Info</h2>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: "Name", value: `${student.first_name} ${student.last_name}` },
                  { label: "Email", value: student.email },
                  { label: "Enrolled", value: student.enrollment_date },
                  { label: "Date of Birth", value: student.date_of_birth || "N/A" },
                  { label: "Guardian", value: student.guardian_name || "N/A" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card shadow-card">
              <div className="p-5 border-b">
                <h2 className="text-base font-semibold">Recent Attendance</h2>
              </div>
              <div className="divide-y max-h-[300px] overflow-y-auto">
                {attendance.slice(0, 10).map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium">{a.date}</p>
                      <p className="text-xs text-muted-foreground">{a.period ? `Period ${a.period}` : ""} {a.subject || ""}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm">
                      {a.status === "Present" ? <CheckCircle className="h-4 w-4 text-success" /> :
                       a.status === "Absent" ? <XCircle className="h-4 w-4 text-destructive" /> :
                       <Clock className="h-4 w-4 text-warning" />}
                      {a.status}
                    </span>
                  </div>
                ))}
                {attendance.length === 0 && (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">No attendance records yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-xl border bg-card shadow-card p-12 text-center">
          <p className="text-muted-foreground">No student record linked to your account yet. Please contact your administrator.</p>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
