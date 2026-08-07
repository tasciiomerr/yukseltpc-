import type { AnyProduct, SpecField } from "@/lib/categories";

export default function SpecTable({
  item,
  fields,
}: {
  item: AnyProduct;
  fields: SpecField[];
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {fields.map((field) => (
          <tr
            key={field.label}
            className="border-b border-black/10 last:border-0 dark:border-white/10"
          >
            <th className="w-1/2 py-2 pr-4 text-left font-medium text-black/60 dark:text-white/60">
              {field.label}
            </th>
            <td className="py-2">{field.value(item)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
