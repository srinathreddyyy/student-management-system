import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const AddStudentDialog = ({ trigger, onSuccess }: AddStudentDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    grade: "", section: "A", gender: "", guardian_name: "", guardian_phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.grade) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("students").insert({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone || null,
      grade: form.grade,
      section: form.section,
      gender: form.gender || null,
      guardian_name: form.guardian_name || null,
      guardian_phone: form.guardian_phone || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Student added!", description: `${form.first_name} ${form.last_name} has been enrolled.` });
      setForm({ first_name: "", last_name: "", email: "", phone: "", grade: "", section: "A", gender: "", guardian_name: "", guardian_phone: "" });
      setOpen(false);
      onSuccess?.();
    }
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <UserPlus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Enroll New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">First Name *</Label>
              <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} placeholder="John" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Last Name *</Label>
              <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john.doe@school.edu" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Grade *</Label>
              <Select value={form.grade} onValueChange={(v) => update("grade", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["9th", "10th", "11th", "12th"].map((g) => <SelectItem key={g} value={g}>{g} Grade</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Section</Label>
              <Select value={form.section} onValueChange={(v) => update("section", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground hover:opacity-90" disabled={saving}>
              {saving ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
