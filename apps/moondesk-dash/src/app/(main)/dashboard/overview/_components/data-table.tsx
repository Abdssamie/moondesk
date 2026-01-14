"use client";

import * as React from "react";

import { Plus } from "lucide-react";
import { z } from "zod";

import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { assetColumns } from "./columns";
import { assetSchema } from "./schema";

export function DataTable({ data: initialData }: { data: z.infer<typeof assetSchema>[] }) {
  const [data, setData] = React.useState(() => initialData);
  const columns = withDndColumn(assetColumns);
  const table = useDataTableInstance({ data, columns, getRowId: (row) => row.id });

  return (
    <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="all">
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assets</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="online">
            Online <Badge variant="secondary">{data.filter((a) => a.status === "Online").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="offline">
            Offline <Badge variant="secondary">{data.filter((a) => a.status === "Offline").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm">
            <Plus />
            <span className="hidden lg:inline">Add Asset</span>
          </Button>
        </div>
      </div>
      <TabsContent value="all" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
      <TabsContent value="online" className="flex flex-col">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
      </TabsContent>
      <TabsContent value="offline" className="flex flex-col">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
      </TabsContent>
      <TabsContent value="maintenance" className="flex flex-col">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
