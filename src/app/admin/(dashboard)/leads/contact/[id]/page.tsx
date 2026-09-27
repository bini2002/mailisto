import { notFound } from "next/navigation";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { requireAdmin } from "@/lib/auth";
import { CONTACT_STATUSES, type ContactSubmission } from "@/lib/types";

export default async function ContactLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("contact_submissions").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as ContactSubmission;
  return <LeadDetail kind="contact" lead={lead} statuses={CONTACT_STATUSES} fields={[{ label: "Message", value: lead.message }]} />;
}
