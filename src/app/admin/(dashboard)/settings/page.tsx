import { saveSettings } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminInput, AdminSection } from "@/components/admin/AdminFields";
import { AdminPageHeader } from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/auth";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("key,value");
  const s = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""])) as Record<string, string>;
  return (
    <>
      <AdminPageHeader title="Settings" description="Shown in the footer and on the contact page. Leave blank to hide." />
      <AdminForm action={saveSettings}>
        <AdminSection title="Contact">
          <AdminInput name="contact_email" type="email" label="Public contact email" defaultValue={s.contact_email} placeholder="hello@mailisto.com" />
        </AdminSection>
        <AdminSection title="Social links" description="Full https:// URLs.">
          <AdminInput name="linkedin_url" type="url" label="LinkedIn" defaultValue={s.linkedin_url} />
          <AdminInput name="instagram_url" type="url" label="Instagram" defaultValue={s.instagram_url} />
          <AdminInput name="x_url" type="url" label="X" defaultValue={s.x_url} />
        </AdminSection>
      </AdminForm>
    </>
  );
}
