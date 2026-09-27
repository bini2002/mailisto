import type { Service } from "./ServiceGrid";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { Icon } = service;
  return (
    <li className="group reveal relative flex flex-col bg-white p-7 transition-colors hover:bg-paper">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-lime transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-center justify-between">
        <Icon aria-hidden="true" className="size-7 text-ink" />
        <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-tight">{service.name}</h3>
      <p className="mt-2 text-sm text-muted">{service.summary}</p>
      <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[0.92rem]">
        {service.items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 bg-ink" />
            {item}
          </li>
        ))}
      </ul>
    </li>
  );
}
