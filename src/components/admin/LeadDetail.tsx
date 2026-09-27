import Link from "next/link";
import { deleteLead, updateLead } from "@/app/admin/actions";
import { safeUrl, formatDate } from "@/lib/utils";
import { ActionButton, AdminForm } from "./AdminForm";
import { AdminSelect, AdminTextarea } from "./AdminFields";
import { AdminPageHeader, StatusPill } from "./AdminTable";

export function LeadDetail({
  kind,
  lead,
  fields,
  statuses,
}: {
  kind: "audit" | "contact";
  lead: { id: string; name: string; email: string; store_url: string | null; status: string; admin_notes: string | null; created_at: string };
  fields: { label: string; value: string | null }[];
  statuses: readonly string[];
}) {
  const store = safeUrl(lead.store_url);
  return (
    <>
      <Link href={`/admin/leads/${kind}`} className="text-sm text-muted hover:text-ink">
        ← Back
      </Link>
      <div className="mt-4">
        <AdminPageHeader title={lead.name} description={`Submitted ${formatDate(lead.created_at, { hour: "2-digit", minute: "2-digit" })}`} actions={<StatusPill value={lead.status} />} />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <dl className="divide-y divide-line border border-line bg-white">
          <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm text-muted">Email</dt>
            <dd>
              <a href={`mailto:${lead.email}`} className="underline underline-offset-2">
                {lead.email}
              </a>
            </dd>
          </div>
          <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm text-muted">Store</dt>
            <dd className="break-all">
              {store ? (
                <a href={store} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">
                  {lead.store_url} ↗
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          {fields.map((f) => (
            <div key={f.label} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr]">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="whitespace-pre-wrap">{f.value || "—"}</dd>
            </div>
          ))}
        </dl>
        <div>
          <AdminForm action={updateLead} submitLabel="Update lead">
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="kind" value={kind} />
            <div className="grid gap-5">
              <AdminSelect name="status" label="Status" options={statuses.map((s) => ({ value: s, label: s.replace("_", " ") }))} defaultValue={lead.status} />
              <AdminTextarea name="admin_notes" label="Internal notes" rows={6} defaultValue={lead.admin_notes ?? ""} />
            </div>
          </AdminForm>
          <div className="mt-4 flex justify-end">
            <ActionButton action={deleteLead} values={{ id: lead.id, kind }} label="Delete lead" variant="danger" confirm="Delete this lead permanently?" />
          </div>
        </div>
      </div>
    </>
  );
}
