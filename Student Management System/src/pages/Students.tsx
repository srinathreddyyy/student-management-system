import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import StudentStatusBadge from "@/components/StudentStatusBadge";
import AddStudentDialog from "@/components/AddStudentDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  section: string;
  gpa: number;
  status: string;
  enrollment_date: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("students")
      .select("id, first_name, last_name, email, grade, section, gpa, status, enrollment_date")
      .order("created_at", { ascending: false });
    if (data) setStudents(data);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = `${s.first_name} ${s.last_name} ${s.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, search, gradeFilter, statusFilter]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} students found</p>
        </div>
        <AddStudentDialog onSuccess={fetchStudents} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Grade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {["9th", "10th", "11th", "12th"].map((g) => <SelectItem key={g} value={g}>{g} Grade</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {["Active", "Inactive", "Graduated", "Suspended"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden sm:table-cell">Grade</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden md:table-cell">GPA</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 hidden lg:table-cell">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
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
                  <td className="px-5 py-3.5 text-sm text-muted-foreground hidden lg:table-cell">{s.enrollment_date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
