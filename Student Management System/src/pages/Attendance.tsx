import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  section: string;
}

interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: string;
  period: string | null;
  subject: string | null;
}

const statusIcon: Record<string, React.ReactNode> = {
  Present: <CheckCircle className="h-4 w-4 text-success" />,
  Absent: <XCircle className="h-4 w-4 text-destructive" />,
  Late: <Clock className="h-4 w-4 text-warning" />,
  Excused: <AlertTriangle className="h-4 w-4 text-info" />,
};

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState("1");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [view, setView] = useState<"mark" | "history">("mark");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const query = supabase.from("students").select("id, first_name, last_name, grade, section").eq("status", "Active");
      const { data } = gradeFilter !== "all" ? await query.eq("grade", gradeFilter) : await query;
      if (data) setStudents(data);
    };
    fetchStudents();
  }, [gradeFilter]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const query = supabase.from("attendance").select("*").eq("date", date);
      if (period !== "all") query.eq("period", period);
      const { data } = await query;
      if (data) {
        setExistingRecords(data);
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.student_id] = r.status; });
        setAttendance(map);
      }
    };
    fetchAttendance();
  }, [date, period]);

  const markAll = (status: string) => {
    const map: Record<string, string> = {};
    students.forEach((s) => { map[s.id] = status; });
    setAttendance(map);
  };

  const saveAttendance = async () => {
    setSaving(true);
    const records = students
      .filter((s) => attendance[s.id])
      .map((s) => ({
        student_id: s.id,
        date,
        status: attendance[s.id],
        period,
        marked_by: user?.id,
      }));

    // Delete existing records for this date/period then insert new
    await supabase.from("attendance").delete().eq("date", date).eq("period", period);
    const { error } = await supabase.from("attendance").insert(records);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: `Attendance for ${date} period ${period} saved.` });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Mark and track student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "mark" ? "default" : "outline"} onClick={() => setView("mark")} size="sm">Mark</Button>
          <Button variant={view === "history" ? "default" : "outline"} onClick={() => setView("history")} size="sm">History</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[180px]" />
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((p) => (
              <SelectItem key={p} value={p}>Period {p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {["9th", "10th", "11th", "12th"].map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {view === "mark" && (
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-muted/40">
            <p className="text-sm font-medium">Mark All:</p>
            <div className="flex gap-2">
              {["Present", "Absent", "Late", "Excused"].map((s) => (
                <Button key={s} variant="outline" size="sm" onClick={() => markAll(s)} className="text-xs">
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Student</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Grade</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {s.first_name[0]}{s.last_name[0]}
                        </div>
                        <span className="text-sm font-medium">{s.first_name} {s.last_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm">{s.grade} - {s.section}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-1">
                        {["Present", "Absent", "Late", "Excused"].map((status) => (
                          <button
                            key={status}
                            onClick={() => setAttendance((a) => ({ ...a, [s.id]: status }))}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              attendance[s.id] === status
                                ? status === "Present" ? "bg-success/20 border-success text-success"
                                : status === "Absent" ? "bg-destructive/20 border-destructive text-destructive"
                                : status === "Late" ? "bg-warning/20 border-warning text-warning-foreground"
                                : "bg-info/20 border-info text-info"
                                : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {status[0]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-12 text-center text-muted-foreground">No active students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {students.length > 0 && (
            <div className="p-4 border-t flex justify-end">
              <Button onClick={saveAttendance} disabled={saving} className="gradient-primary text-primary-foreground">
                {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          )}
        </div>
      )}

      {view === "history" && (
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Student</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Period</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {existingRecords.map((r) => {
                  const student = students.find((s) => s.id === r.student_id);
                  return (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="px-5 py-3 text-sm font-medium">
                        {student ? `${student.first_name} ${student.last_name}` : "Unknown"}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{r.date}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">Period {r.period}</td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1.5 text-sm">
                          {statusIcon[r.status]} {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {existingRecords.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">No records for this date.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
