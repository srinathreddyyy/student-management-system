import { Student } from "@/lib/students-data";

const statusStyles: Record<Student["status"], string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Graduated: "bg-primary/10 text-primary border-primary/20",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

const StudentStatusBadge = ({ status }: { status: Student["status"] }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default StudentStatusBadge;
