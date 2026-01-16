import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export default function DataTable<T>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <Table>

      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}

          {(onView || onEdit || onDelete) && (
            <TableHead className="text-right">Acciones</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i} className="hover:bg-muted/40">

            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                {col.render
                  ? col.render(row)
                  : (row as any)[col.key]}
              </TableCell>
            ))}

            {(onView || onEdit || onDelete) && (
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-primario">
                      <span className="material-icons">more_vert</span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(row)}>
                        <span className="material-icons text-sm mr-2">
                          visibility
                        </span>
                        Ver más
                      </DropdownMenuItem>
                    )}

                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(row)}>
                        <span className="material-icons text-sm mr-2">
                          edit
                        </span>
                        Editar
                      </DropdownMenuItem>
                    )}

                    {onDelete && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(row)}
                      >
                        <span className="material-icons text-sm mr-2">
                          delete
                        </span>
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}

          </TableRow>
        ))}
      </TableBody>

    </Table>
  );
}
