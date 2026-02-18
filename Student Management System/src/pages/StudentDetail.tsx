import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StudentStatusBadge from "@/components/StudentStatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User } from "lucide-react";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  grade: string;
  section: string;
  enrollment_date: string;
  status: string;
  address: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  gpa: number;
}

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("students").select("*").eq("id", id).single();
      if (data) setStudent(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-lg text-muted-foreground">Student not found.</p>
        <Button variant="outline" onClick={() => navigate("/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
        </Button>
      </div>
    );
  }

  const infoItems = [
    { icon: Mail, label: "Email", value: student.email },
    { icon: Phone, label: "Phone", value: student.phone || "N/A" },
    { icon: MapPin, label: "Address", value: student.address || "N/A" },
    { icon: Calendar, label: "Date of Birth", value: student.date_of_birth || "N/A" },
    { icon: User, label: "Gender", value: student.gender || "N/A" },
    { icon: Calendar, label: "Enrolled", value: student.enrollment_date },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="gradient-primary px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold text-primary-foreground border-2 border-primary-foreground/30">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">{student.first_name} {student.last_name}</h1>
              <div className="mt-2"><StudentStatusBadge status={student.status as any} /></div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Personal Information</h2>
            <div className="space-y-3">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2 mt-0.5"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Academic Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Grade</p>
                  <p className="text-lg font-bold">{student.grade}</p>
                  <p className="text-xs text-muted-foreground">Section {student.section}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">GPA</p>
                  <p className="text-lg font-bold text-primary">{student.gpa}</p>
                  <p className="text-xs text-muted-foreground">/ 4.00</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Guardian Info</h2>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{student.guardian_name || "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{student.guardian_phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
