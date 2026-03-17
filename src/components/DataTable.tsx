import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, FileText, QrCode } from "lucide-react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  searchableValue?: (row: T) => string;
};

type DataTableProps<T> = {
  titulo: string;
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  showExcel?: boolean;
  showPDF?: boolean;
  showQR?: boolean;
  onExcel?: (data: T[], titulo: string) => void;
  onQr?: (data: T[]) => void;
};

export default function DataTable<T>({
  titulo,
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  showExcel,
  showPDF,
  showQR,
  onExcel,
  onQr,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 🔍 Filtro
  const filteredData = useMemo(() => {
    if (!search) return data;

    const searchLower = search.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        if (col.searchableValue) {
          return col
            .searchableValue(row)
            .toLowerCase()
            .includes(searchLower);
        }

        if (col.render) return false;

        const value = String((row as any)[col.key] ?? "");
        return value.toLowerCase().includes(searchLower);
      })
    );
  }, [search, data, columns]);

  // 📄 Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 dark:bg-oscuro-relleno dark:border-oscuro-redondear space-y-4">
      {/* 🔍 Buscador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">

        {/* Título */}
        <h2 className="text-xl font-semibold">
          {titulo}
        </h2>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          {showExcel && (
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-emerald-700 text-white hover:bg-emerald-800 hover:text-white"
              onClick={() => onExcel?.(data, titulo)}
            >
              <FileSpreadsheet size={16} />
              Excel
            </Button>
          )}

          {showPDF && (
            <Button variant="outline" size="lg" className="flex items-center gap-2 bg-gray-200 text-red-600 hover:bg-gray-300 hover:text-red-600">
              <FileText size={16} />
              PDF
            </Button>
          )}

          {showQR && (
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-sky-900 text-white hover:bg-sky-800 hover:text-white"
              onClick={() => onQr?.(data)}>
              <QrCode size={16} />
              QR
            </Button>
          )}
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">

          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full"
          />
        </div>

      </div>

      {/* 📊 Tabla */}
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
          {paginatedData.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center text-muted-foreground"
              >
                No hay resultados
              </TableCell>
            </TableRow>
          )}

          {paginatedData.map((row, i) => (
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
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onView(row)}
                      >
                        <span className="material-icons text-sm">
                          visibility
                        </span>
                      </Button>
                    )}

                    {onEdit && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(row)}
                      >
                        <span className="material-icons text-sm">
                          edit
                        </span>
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => onDelete(row)}
                      >
                        <span className="material-icons text-sm">
                          delete
                        </span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 📄 Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
