import { notFound } from "next/navigation";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { requireAdmin } from "@/lib/auth";
import { AUDIT_STATUSES, type AuditSubmission } from "@/lib/types";

export default async function AuditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("audit_submissions").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as AuditSubmission;
  return (
    <LeadDetail
      kind="audit"
      lead={lead}
      statuses={AUDIT_STATUSES}
      fields={[
        { label: "Monthly revenue", value: lead.revenue_range },
        { label: "Email platform", value: lead.platform },
        { label: "List size", value: lead.list_size },
        { label: "Biggest challenge", value: lead.challenge },
        { label: "Additional info", value: lead.details },
      ]}
    />
  );
}
