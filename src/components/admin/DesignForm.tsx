import { deleteDesign, saveDesign } from "@/app/admin/actions";
import { emailConcepts } from "@/content/email-concepts";
import { DESIGN_TAGS, type EmailDesign } from "@/lib/types";
import { ActionButton, AdminForm } from "./AdminForm";
import { AdminCheckbox, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "./AdminFields";
import { ImageUploader } from "./ImageUploader";

const EMAIL_TYPES = [
  "Welcome",
  "Abandoned cart",
  "Browse abandonment",
  "Post-purchase",
  "Replenishment",
  "Win-back",
  "VIP",
  "Product launch",
  "New collection",
  "Promotional",
  "Seasonal",
  "Educational",
];

export function DesignForm({ design }: { design?: EmailDesign }) {
  return (
    <>
      <AdminForm action={saveDesign} submitLabel={design ? "Save changes" : "Create design"}>
        {design && <input type="hidden" name="id" value={design.id} />}

        <AdminSection title="Design">
          <AdminInput name="title" label="Title" required maxLength={140} defaultValue={design?.title} />
          <AdminInput name="slug" label="Slug" hint="Leave blank to generate from the title." defaultValue={design?.slug} maxLength={120} />
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminSelect name="kind" label="Type" options={[{ value: "campaign", label: "Campaign" }, { value: "flow", label: "Flow" }]} defaultValue={design?.kind ?? "campaign"} />
            <AdminSelect name="email_type" label="Email type" options={EMAIL_TYPES} defaultValue={design?.email_type ?? "Promotional"} />
          </div>
          <fieldset>
            <legend className="text-sm font-medium">Filter tags</legend>
            <div className="mt-3 flex flex-wrap gap-5">
              {DESIGN_TAGS.map((t) => (
                <AdminCheckbox key={t} name="tags" value={t} label={t[0].toUpperCase() + t.slice(1)} defaultChecked={design?.tags.includes(t)} />
              ))}
            </div>
          </fieldset>
        </AdminSection>

        <AdminSection title="Preview" description="Upload a full-length email screenshot (PNG/JPG/WebP, max 5 MB). It is never cropped or distorted in the detail view.">
          <ImageUploader name="image_url" label="Email screenshot" folder="designs" defaultValue={design?.image_url} />
          <AdminInput name="image_alt" label="Image alt text" maxLength={200} defaultValue={design?.image_alt ?? ""} hint="Describe the email, e.g. “Abandoned cart email showing a running shoe and free returns message”." />
          <AdminSelect
            name="concept_template"
            label="Or use a built-in coded concept"
            hint="Used when no screenshot is uploaded."
            options={[{ value: "", label: "None" }, ...emailConcepts.map((c) => ({ value: c.key, label: `${c.brand}: ${c.title}` }))]}
            defaultValue={design?.concept_template ?? ""}
          />
        </AdminSection>

        <AdminSection title="Strategy notes">
          <AdminTextarea name="objective" label="Objective" rows={2} maxLength={300} defaultValue={design?.objective ?? ""} />
          <AdminTextarea name="description" label="Short description / thinking" rows={3} maxLength={600} defaultValue={design?.description ?? ""} />
          <AdminTextarea name="creative_direction" label="Creative direction" rows={3} maxLength={600} defaultValue={design?.creative_direction ?? ""} />
        </AdminSection>

        <AdminSection title="Attribution" description="Honesty matters. Only mark as client work with the client's permission.">
          <AdminCheckbox name="is_concept" label="This is a concept (not client work)" hint="Shows a “Concept” label on the site." defaultChecked={design ? design.is_concept : true} />
          <AdminInput name="client_name" label="Client name" hint="Only for real client work. Ignored for concepts." maxLength={120} defaultValue={design?.client_name ?? ""} />
        </AdminSection>

        <AdminSection title="Display">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput name="sort_order" type="number" label="Sort order" hint="Lower numbers show first." defaultValue={design?.sort_order ?? 0} />
          </div>
          <AdminCheckbox name="featured" label="Featured on homepage" defaultChecked={design?.featured} />
          <AdminCheckbox name="published" label="Published" defaultChecked={design ? design.published : true} />
        </AdminSection>
      </AdminForm>
      {design && (
        <div className="mt-6 flex justify-end">
          <ActionButton action={deleteDesign} values={{ id: design.id }} label="Delete design" variant="danger" confirm="Delete this design permanently?" />
        </div>
      )}
    </>
  );
}
