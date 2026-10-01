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
      <AdminPageHeader title="Settings" description="Site-wide details: contact info, booking, hero video and social links. Leave blank to hide." />
      <AdminForm action={saveSettings}>
        <AdminSection title="Contact">
          <AdminInput name="contact_email" type="email" label="Public contact email" defaultValue={s.contact_email} placeholder="hello@mailisto.com" />
        </AdminSection>
        <AdminSection title="Booking" description="Shown as a “Book a call” option on the contact page. Leave blank to hide.">
          <AdminInput name="calendly_url" type="url" label="Calendly link" placeholder="https://calendly.com/your-name/30min" defaultValue={s.calendly_url} />
        </AdminSection>
        <AdminSection
          title="Homepage hero video"
          description="An MP4 (H.264) that plays muted under the hero and grows to full screen as visitors scroll. Leave blank to use /videos/hero.mp4 if that file exists."
        >
          <AdminInput name="hero_video_url" label="Video URL" placeholder="https://… or /videos/hero.mp4" defaultValue={s.hero_video_url} />
          <AdminInput name="hero_video_poster" label="Poster image URL" hint="Shown while the video loads. 16:9, e.g. 1920×1080." placeholder="https://… or /images/hero-poster.jpg" defaultValue={s.hero_video_poster} />
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
