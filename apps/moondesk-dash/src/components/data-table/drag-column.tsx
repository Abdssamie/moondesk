import { useSortable } from "@dnd-kit/sortable";
import { ColumnDef } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Using unknown instead of any to fix lint warning
export const dragColumn: ColumnDef<unknown> = {
  id: "drag",
  header: () => null,
  cell: ({ row }) => <DragHandle id={(row.original as { id: number }).id} />,
  enableSorting: false,
  enableHiding: false,
};
