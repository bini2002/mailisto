const chain = ["Shopify data", "Klaviyo", "Flows + campaigns", "Repeat purchases", "Revenue"];

export function PositioningStrip() {
  return (
    <section aria-label="What Mailisto focuses on" className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-16">
        <p className="reveal text-[1.6rem] leading-tight font-semibold tracking-[-0.03em] sm:text-3xl lg:col-span-5">
          Klaviyo-focused.
          <br />
          Ecommerce-native.
          <br />
          <span className="text-lime">Revenue-driven.</span>
        </p>
        <ol className="flex flex-wrap items-center gap-y-2 lg:col-span-7 lg:justify-end" aria-label="How email becomes revenue">
          {chain.map((step, i) => (
            <li key={step} className="reveal flex items-center">
              <span
                className={`label whitespace-nowrap border px-3 py-2.5 ${
                  i === chain.length - 1 ? "border-lime bg-lime text-ink" : "border-line-dark text-white/85"
                }`}
              >
                {step}
              </span>
              {i < chain.length - 1 && (
                <span aria-hidden="true" className="h-px w-4 bg-line-dark sm:w-6" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
