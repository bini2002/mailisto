import { deleteHeroSlide, saveHeroSlide } from "@/app/admin/actions";
import { emailConcepts } from "@/content/email-concepts";
import type { HeroSlide } from "@/lib/types";
import { ActionButton, AdminForm } from "./AdminForm";
import { AdminCheckbox, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "./AdminFields";
import { ImageUploader } from "./ImageUploader";

export function HeroSlideForm({ slide }: { slide?: HeroSlide }) {
  return (
    <>
      <AdminForm action={saveHeroSlide} submitLabel={slide ? "Save changes" : "Create slide"}>
        {slide && <input type="hidden" name="id" value={slide.id} />}

        <AdminSection
          title="Design"
          description="Shown on the right of the homepage hero. Use a 4:5 image (about 1120×1400 px) so every slide lines up. PNG, JPG or WebP, up to 5 MB."
        >
          <ImageUploader name="image_url" label="Design image" folder="hero" defaultValue={slide?.image_url} />
          <AdminInput name="image_alt" label="Image description (alt text)" maxLength={200} defaultValue={slide?.image_alt ?? ""} hint="Describe the design for screen readers, e.g. “Abandoned cart email for a sneaker brand”." />
          <AdminSelect
            name="concept_template"
            label="Or use a built-in design"
            hint="Used only when no image is uploaded."
            options={[{ value: "", label: "None" }, ...emailConcepts.map((c) => ({ value: c.key, label: `${c.brand}: ${c.title}` }))]}
            defaultValue={slide?.concept_template ?? ""}
          />
        </AdminSection>

        <AdminSection title="Text around the design">
          <AdminInput name="label" label="Label above" maxLength={80} placeholder="Flow · Welcome · Email 1 of 4" defaultValue={slide?.label ?? ""} />
          <AdminInput name="caption" label="Caption below" maxLength={120} placeholder="Design Lab concept · fictional brand" defaultValue={slide?.caption ?? ""} />
          <AdminTextarea name="notes" label="Notes (optional)" hint="One per line, up to 4. Shown as a numbered list under the design." rows={4} maxLength={600} defaultValue={slide?.notes ?? ""} />
        </AdminSection>

        <AdminSection title="Display">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminInput name="sort_order" type="number" label="Order" hint="Lower numbers show first." defaultValue={slide?.sort_order ?? 0} />
          </div>
          <AdminCheckbox name="published" label="Show on the website" defaultChecked={slide ? slide.published : true} />
        </AdminSection>
      </AdminForm>
      {slide && (
        <div className="mt-6 flex justify-end">
          <ActionButton action={deleteHeroSlide} values={{ id: slide.id }} label="Delete slide" variant="danger" confirm="Delete this slide permanently?" />
        </div>
      )}
    </>
  );
}
