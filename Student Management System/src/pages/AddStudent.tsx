import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AddStudent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", date_of_birth: "",
    grade: "", section: "A", gender: "", address: "",
    guardian_name: "", guardian_phone: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.grade) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("students").insert({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone || null,
      date_of_birth: form.date_of_birth || null,
      grade: form.grade,
      section: form.section,
      gender: form.gender || null,
      address: form.address || null,
      guardian_name: form.guardian_name || null,
      guardian_phone: form.guardian_phone || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Student enrolled!", description: `${form.first_name} ${form.last_name} has been added.` });
      navigate("/students");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Student</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details to enroll a new student</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border bg-card shadow-card p-6 space-y-5">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">First Name *</Label>
              <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Last Name *</Label>
              <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Date of Birth</Label>
              <Input type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Address</Label>
            <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Academic Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Guardian Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Guardian Name</Label>
              <Input value={form.guardian_name} onChange={(e) => update("guardian_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Guardian Phone</Label>
              <Input value={form.guardian_phone} onChange={(e) => update("guardian_phone", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate("/students")}>Cancel</Button>
          <Button type="submit" className="gradient-primary text-primary-foreground hover:opacity-90" disabled={saving}>
            {saving ? "Enrolling..." : "Enroll Student"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
