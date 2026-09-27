const principles = [
  { title: "Revenue over vanity metrics.", body: "Open rates matter. Revenue matters more." },
  { title: "Strategy before sending.", body: "Every campaign should have a reason to exist." },
  { title: "Lifecycle over one-offs.", body: "The real value is in the system, not the single send." },
  { title: "Creative meets data.", body: "Great design without strategy is decoration. Great strategy without creative gets ignored." },
  { title: "Test what’s worth testing.", body: "Better decisions come from clear questions, not more dashboards." },
];

export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="section-y border-t border-line bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label flex items-center gap-3 text-muted">
            <span className="text-ink">08</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            Why Mailisto
          </p>
          <h2 id="principles-title" className="mt-5 text-h2 font-semibold lg:sticky lg:top-28">
            How we work.
          </h2>
        </div>
        <ol className="lg:col-span-8">
          {principles.map((p, i) => (
            <li key={p.title} className="reveal grid gap-2 border-t border-line py-8 first:border-ink sm:grid-cols-[3rem_1fr] sm:gap-6">
              <span className="label pt-2 text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{p.title}</h3>
                <p className="mt-2 text-lg text-muted">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
