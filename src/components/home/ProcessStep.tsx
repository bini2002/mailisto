export interface Step {
  name: string;
  line: string;
  body: string;
  output: string;
}

export function ProcessStep({ step, index }: { step: Step; index: number }) {
  return (
    <li className="group reveal grid gap-3 border-b border-line py-8 transition-colors hover:bg-white sm:grid-cols-12 sm:gap-6 sm:px-4 lg:py-10">
      <div className="flex items-baseline gap-4 sm:col-span-4 lg:col-span-4">
        <span className="text-sm font-medium text-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="text-3xl font-semibold tracking-tight lg:text-4xl">{step.name}</h3>
      </div>
      <div className="sm:col-span-8 lg:col-span-5">
        <p className="font-medium">{step.line}</p>
        <p className="mt-1.5 text-[0.95rem] text-muted">{step.body}</p>
      </div>
      <div className="sm:col-span-8 sm:col-start-5 lg:col-span-3 lg:col-start-auto lg:text-right">
        <span className="label inline-flex items-center gap-2 border border-line bg-paper px-3 py-2 text-ink transition-colors group-hover:border-ink">
          <span aria-hidden="true" className="size-1.5 bg-lime ring-1 ring-ink/30" />
          {step.output}
        </span>
      </div>
    </li>
  );
}
