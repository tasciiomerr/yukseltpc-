import type { AnyProduct, SpecField } from "@/lib/categories";

export default function SpecTable({
  item,
  fields,
}: {
  item: AnyProduct;
  fields: SpecField[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {fields.map((field, index) => (
            <tr
              key={field.label}
              className={index % 2 === 0 ? "bg-surface" : "bg-background"}
            >
              <th className="w-1/2 px-4 py-2.5 text-left font-medium text-foreground/60">
                {field.label}
              </th>
              <td className="px-4 py-2.5 font-medium text-foreground">
                {field.value(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
