import { deleteCaseStudy, saveCaseStudy } from "@/app/admin/actions";
import type { CaseStudy } from "@/lib/types";
import { ActionButton, AdminForm } from "./AdminForm";
import { AdminCheckbox, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "./AdminFields";
import { ImageListField, ImageUploader } from "./ImageUploader";

export function CaseStudyForm({ study }: { study?: CaseStudy }) {
  const results = (study?.results ?? []).map((r) => `${r.label} | ${r.value}`).join("\n");
  return (
    <>
      <p className="mb-6 border-l-2 border-lime bg-white p-4 text-sm">
        Only publish real, verifiable results with the client&rsquo;s permission. The public case-study section stays hidden until at least one case study is published.
      </p>
      <AdminForm action={saveCaseStudy} submitLabel={study ? "Save changes" : "Create case study"}>
        {study && <input type="hidden" name="id" value={study.id} />}

        <AdminSection title="Overview">
          <AdminInput name="title" label="Title" required maxLength={160} defaultValue={study?.title} />
          <AdminInput name="slug" label="Slug" hint="URL: /work/your-slug. Leave blank to generate." defaultValue={study?.slug} maxLength={120} />
          <div className="grid gap-5 sm:grid-cols-3">
            <AdminInput name="client_name" label="Client name" required maxLength={120} defaultValue={study?.client_name} />
            <AdminInput name="industry" label="Industry" maxLength={80} defaultValue={study?.industry ?? ""} />
            <AdminInput name="project_date" type="date" label="Date" defaultValue={study?.project_date ?? ""} />
          </div>
          <AdminTextarea name="summary" label="Summary" rows={2} maxLength={400} defaultValue={study?.summary ?? ""} />
        </AdminSection>

        <AdminSection title="Story">
          <AdminTextarea name="challenge" label="Challenge" rows={4} defaultValue={study?.challenge ?? ""} />
          <AdminTextarea name="strategy" label="Strategy" rows={4} defaultValue={study?.strategy ?? ""} />
          <AdminTextarea name="implementation" label="Implementation" rows={4} defaultValue={study?.implementation ?? ""} />
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminTextarea name="before_state" label="Before" rows={3} defaultValue={study?.before_state ?? ""} />
            <AdminTextarea name="after_state" label="After" rows={3} defaultValue={study?.after_state ?? ""} />
          </div>
        </AdminSection>

        <AdminSection title="Results" description="One per line: Label | Value. Example: Flow revenue share | 38%">
          <AdminTextarea name="results" label="Headline results" rows={4} defaultValue={results} placeholder={"Label | Value"} className="font-mono" />
          <AdminTextarea name="revenue_attribution" label="How results were measured" hint="Attribution window, date range and comparison period. Be specific." rows={3} defaultValue={study?.revenue_attribution ?? ""} />
        </AdminSection>

        <AdminSection title="Images">
          <ImageUploader name="cover_image_url" label="Cover image" folder="case-studies" defaultValue={study?.cover_image_url} />
          <AdminInput name="cover_image_alt" label="Cover image alt text" maxLength={200} defaultValue={study?.cover_image_alt ?? ""} />
          <ImageListField name="screenshots" label="Email screenshots" folder="case-studies" defaultValue={study?.screenshots ?? []} />
        </AdminSection>

        <AdminSection title="Testimonial" description="Only real quotes, approved by the person quoted.">
          <AdminTextarea name="testimonial_quote" label="Quote" rows={3} defaultValue={study?.testimonial_quote ?? ""} />
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput name="testimonial_author" label="Name" maxLength={120} defaultValue={study?.testimonial_author ?? ""} />
            <AdminInput name="testimonial_role" label="Role" maxLength={120} defaultValue={study?.testimonial_role ?? ""} />
          </div>
        </AdminSection>

        <AdminSection title="Publishing & SEO">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminSelect name="status" label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} defaultValue={study?.status ?? "draft"} />
            <AdminInput name="sort_order" type="number" label="Sort order" defaultValue={study?.sort_order ?? 0} />
          </div>
          <AdminCheckbox name="featured" label="Featured" defaultChecked={study?.featured} />
          <AdminInput name="seo_title" label="SEO title" maxLength={70} defaultValue={study?.seo_title ?? ""} />
          <AdminTextarea name="seo_description" label="Meta description" rows={2} maxLength={170} defaultValue={study?.seo_description ?? ""} />
        </AdminSection>
      </AdminForm>
      {study && (
        <div className="mt-6 flex justify-end">
          <ActionButton action={deleteCaseStudy} values={{ id: study.id }} label="Delete case study" variant="danger" confirm="Delete this case study permanently?" />
        </div>
      )}
    </>
  );
}
