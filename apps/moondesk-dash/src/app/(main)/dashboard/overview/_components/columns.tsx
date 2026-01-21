import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, EllipsisVertical, AlertCircle, Clock, MapPin, Activity } from "lucide-react";
import { z } from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { assetSchema } from "./schema";

export const assetColumns: ColumnDef<z.infer<typeof assetSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Asset Name" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.getValue("type")}
        </Badge>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status");
      const isOnline = status === "Online";
      return (
        <Badge variant="outline" className="text-muted-foreground gap-1.5 px-1.5">
          {isOnline ? (
            <CircleCheck className="size-3.5 fill-green-500 dark:fill-green-400" />
          ) : (
            <AlertCircle className="fill-destructive/20 text-destructive size-3.5" />
          )}
          {status}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground flex items-center gap-1.5">
        <MapPin className="size-3.5" />
        <span>{row.getValue("location")}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "lastReading",
    header: ({ column }) => <DataTableColumnHeader className="text-right" column={column} title="Last Reading" />,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1.5">
        <Activity className="text-muted-foreground size-3.5" />
        <span className="font-mono">{row.getValue("lastReading")}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "lastSeen",
    header: ({ column }) => <DataTableColumnHeader className="text-right" column={column} title="Last Seen" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground flex items-center justify-end gap-1.5">
        <Clock className="size-3.5" />
        <span>{row.getValue("lastSeen")}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>View Sensors</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Maintenance</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
