interface Option {
  slug: string;
  name: string;
}

interface ComponentSelectProps {
  label: string;
  value: string;
  onChange: (slug: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function ComponentSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Seçilmedi",
}: ComponentSelectProps) {
  const id = `select-${label}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground/70">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
