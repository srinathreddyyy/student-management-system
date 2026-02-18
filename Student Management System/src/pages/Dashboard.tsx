import { useState, useEffect } from "react";
import { Users, UserCheck, BookOpen, TrendingUp, GraduationCap, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import StudentStatusBadge from "@/components/StudentStatusBadge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  section: string;
  gpa: number;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase.from("students").select("id, first_name, last_name, email, grade, section, gpa, status");
      if (data) setStudents(data);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const avgGpa = students.length > 0 ? Math.round((students.reduce((sum, s) => sum + Number(s.gpa), 0) / students.length) * 100) / 100 : 0;
  const graduatedCount = students.filter((s) => s.status === "Graduated").length;
  const recentStudents = students.slice(0, 5);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your student management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} variant="primary" />
        <StatCard title="Active Students" value={activeStudents} icon={UserCheck} variant="accent" />
        <StatCard title="Average GPA" value={avgGpa} icon={TrendingUp} variant="warning" />
        <StatCard title="Graduated" value={graduatedCount} icon={GraduationCap} />
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-base font-semibold">Recent Students</h2>
          <button onClick={() => navigate("/students")} className="text-sm font-medium text-primary hover:underline">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden sm:table-cell">Grade</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden md:table-cell">GPA</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {s.first_name[0]}{s.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.first_name} {s.last_name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm hidden sm:table-cell">{s.grade} - {s.section}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold hidden md:table-cell">{s.gpa}</td>
                  <td className="px-5 py-3.5"><StudentStatusBadge status={s.status as any} /></td>
                </tr>
              ))}
              {recentStudents.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">No students yet. Add some!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
