import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Tree from "react-d3-tree";
import { obtenerOrganigrama } from "@/functions/ActionsNombramiento";
import NodoCard from "./NodoCard";

export default function OrganigramaTree({ refresh, onEditar, onDelete, viewHistory }: any) {

  const [treeData, setTreeData] = useState<any>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<any>(null);

  useEffect(() => {
    cargarOrganigrama();
  }, [refresh]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      setTranslate({
        x: rect.width / 2,
        y: 120
      });
    }
  }, [treeData]);

  const cargarOrganigrama = async () => {
    const res = await obtenerOrganigrama();
    if (res.success) setTreeData(res.data);
  };

  if (!treeData) return <div className="p-10">Cargando...</div>;

  return (
    <div
      ref={containerRef}
      className="w-full h-[85vh] bg-gray-50 dark:bg-oscuro-relleno rounded-xl border overflow-auto cursor-grab active:cursor-grabbing"
    >
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        zoomable
        collapsible
        separation={{ siblings: 2.5, nonSiblings: 2.5 }}
        nodeSize={{ x: 140, y: 200 }}
        translate={translate}
        renderCustomNodeElement={(props) =>
          <NodoCard
            {...props}
            onEditar={onEditar}
            onDelete={onDelete}
            viewHistory={viewHistory}
          />
        }
      />
    </div>
  );
}