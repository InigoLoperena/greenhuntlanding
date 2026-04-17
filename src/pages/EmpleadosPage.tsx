import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Play, Square, Pencil, Trash2, Save, X, CalendarClock } from "lucide-react";

const EMPLOYEES = ["Andrea", "Isvara", "Joaquina", "Pablo", "Lucas"] as const;
type Employee = (typeof EMPLOYEES)[number];

interface TimeEntry {
  id: string;
  employee_name: string;
  start_time: string;
  end_time: string | null;
  total_minutes: number | null;
  description: string | null;
}

const STORAGE_KEY = "greenhunt_active_timers";

type ActiveTimers = Partial<Record<Employee, { id: string; start: string }>>;

const loadActive = (): ActiveTimers => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveActive = (a: ActiveTimers) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));

const formatDuration = (minutes: number | null) => {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const EmployeeSection = ({
  name,
  entries,
  active,
  onStart,
  onStop,
  onUpdate,
  onDelete,
  elapsed,
}: {
  name: Employee;
  entries: TimeEntry[];
  active: { id: string; start: string } | undefined;
  onStart: (name: Employee) => void;
  onStop: (name: Employee) => void;
  onUpdate: (id: string, patch: Partial<TimeEntry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  elapsed: number;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const beginEdit = (e: TimeEntry) => {
    setEditingId(e.id);
    setEditStart(e.start_time ? e.start_time.slice(0, 16) : "");
    setEditEnd(e.end_time ? e.end_time.slice(0, 16) : "");
    setEditDesc(e.description || "");
  };

  const saveEdit = async (id: string) => {
    const startISO = new Date(editStart).toISOString();
    const endISO = editEnd ? new Date(editEnd).toISOString() : null;
    const totalMinutes = endISO
      ? Math.max(
          0,
          Math.round(
            (new Date(endISO).getTime() - new Date(startISO).getTime()) / 60000
          )
        )
      : null;
    await onUpdate(id, {
      start_time: startISO,
      end_time: endISO,
      total_minutes: totalMinutes,
      description: editDesc,
    });
    setEditingId(null);
  };

  const handleStop = async () => {
    onStop(name);
  };

  const handleStart = () => {
    onStart(name);
    setNewDesc("");
  };

  // When stopping we want to attach a description — handled via inline edit after stop.
  // But to make it simpler, we update description if provided right when stopping:
  const handleStopWithDesc = async () => {
    if (!active) return;
    const id = active.id;
    const endISO = new Date().toISOString();
    const totalMinutes = Math.max(
      0,
      Math.round(
        (new Date(endISO).getTime() - new Date(active.start).getTime()) / 60000
      )
    );
    await onUpdate(id, {
      end_time: endISO,
      total_minutes: totalMinutes,
      description: newDesc || null,
    });
    onStop(name);
    setNewDesc("");
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle
          className="font-permanent-marker text-3xl"
          style={{ color: "#b4fa74" }}
        >
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {!active ? (
            <Button
              onClick={handleStart}
              className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
            >
              <Play className="mr-1" /> Iniciar contador
            </Button>
          ) : (
            <>
              <div className="text-[#b4fa74] font-mono text-lg">
                ⏱ {Math.floor(elapsed / 60)}h {elapsed % 60}m corriendo
              </div>
              <Input
                placeholder="Descripción del trabajo"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white max-w-md"
              />
              <Button
                onClick={handleStopWithDesc}
                variant="destructive"
                className="font-permanent-marker"
              >
                <Square className="mr-1" /> Detener contador
              </Button>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-300">Inicio</TableHead>
                <TableHead className="text-zinc-300">Fin</TableHead>
                <TableHead className="text-zinc-300">Duración</TableHead>
                <TableHead className="text-zinc-300">Descripción</TableHead>
                <TableHead className="text-zinc-300 w-32">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 && (
                <TableRow className="border-zinc-800">
                  <TableCell colSpan={5} className="text-zinc-500 text-center">
                    Sin registros aún.
                  </TableCell>
                </TableRow>
              )}
              {entries.map((e) =>
                editingId === e.id ? (
                  <TableRow key={e.id} className="border-zinc-800">
                    <TableCell>
                      <label className="flex items-center gap-2 text-[#b4fa74] text-xs font-permanent-marker mb-1">
                        <CalendarClock className="w-4 h-4" /> Entrada
                      </label>
                      <Input
                        type="datetime-local"
                        value={editStart}
                        onChange={(ev) => setEditStart(ev.target.value)}
                        className="bg-zinc-800 border-2 border-[#a2c041] text-white text-base h-12 [color-scheme:dark]"
                      />
                    </TableCell>
                    <TableCell>
                      <label className="flex items-center gap-2 text-[#b4fa74] text-xs font-permanent-marker mb-1">
                        <CalendarClock className="w-4 h-4" /> Salida
                      </label>
                      <Input
                        type="datetime-local"
                        value={editEnd}
                        onChange={(ev) => setEditEnd(ev.target.value)}
                        className="bg-zinc-800 border-2 border-[#a2c041] text-white text-base h-12 [color-scheme:dark]"
                      />
                    </TableCell>
                    <TableCell className="text-zinc-400">auto</TableCell>
                    <TableCell>
                      <Textarea
                        value={editDesc}
                        onChange={(ev) => setEditDesc(ev.target.value)}
                        className="bg-zinc-800 border-2 border-[#a2c041] text-white min-h-[48px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => saveEdit(e.id)}
                          className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
                        >
                          <Save className="mr-1" /> Guardar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                        >
                          <X className="mr-1" /> Cancelar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={e.id} className="border-zinc-800 text-white">
                    <TableCell>{formatDateTime(e.start_time)}</TableCell>
                    <TableCell>
                      {e.end_time ? (
                        formatDateTime(e.end_time)
                      ) : (
                        <span className="text-[#b4fa74]">en curso</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDuration(e.total_minutes)}</TableCell>
                    <TableCell className="max-w-xs whitespace-pre-wrap">
                      {e.description || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => beginEdit(e)}
                          className="bg-[#a2c041] hover:bg-[#8da836] text-[#611a5a] font-permanent-marker"
                        >
                          <Pencil className="mr-1" /> Editar
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("¿Eliminar este registro?"))
                              onDelete(e.id);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const EmpleadosPage = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [active, setActive] = useState<ActiveTimers>(loadActive());
  const [tick, setTick] = useState(0);

  // Block indexing
  useEffect(() => {
    document.title = "Empleados — Interno";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // tick every minute for live elapsed display
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("employee_time_entries")
      .select("*")
      .order("start_time", { ascending: false });
    if (error) {
      toast.error("Error cargando registros");
      return;
    }
    setEntries(data as TimeEntry[]);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleStart = async (name: Employee) => {
    const start = new Date().toISOString();
    const { data, error } = await supabase
      .from("employee_time_entries")
      .insert({ employee_name: name, start_time: start })
      .select()
      .single();
    if (error || !data) {
      toast.error("No se pudo iniciar el contador");
      return;
    }
    const next = { ...active, [name]: { id: data.id, start } };
    setActive(next);
    saveActive(next);
    fetchEntries();
    toast.success(`Contador iniciado para ${name}`);
  };

  const handleStop = (name: Employee) => {
    const next = { ...active };
    delete next[name];
    setActive(next);
    saveActive(next);
    fetchEntries();
    toast.success(`Contador detenido para ${name}`);
  };

  const handleUpdate = async (id: string, patch: Partial<TimeEntry>) => {
    const { error } = await supabase
      .from("employee_time_entries")
      .update(patch)
      .eq("id", id);
    if (error) {
      toast.error("Error actualizando registro");
      return;
    }
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("employee_time_entries")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Error eliminando registro");
      return;
    }
    // also clear local active if needed
    const next = { ...active };
    (Object.keys(next) as Employee[]).forEach((k) => {
      if (next[k]?.id === id) delete next[k];
    });
    setActive(next);
    saveActive(next);
    fetchEntries();
    toast.success("Registro eliminado");
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1
            className="font-permanent-marker text-5xl"
            style={{ color: "#b4fa74" }}
          >
            Registro de Horas
          </h1>
          <p className="text-subtitle-styled text-3xl mt-2">
            sistema interno greenhunt
          </p>
        </header>

        {EMPLOYEES.map((name) => {
          const employeeEntries = entries.filter(
            (e) => e.employee_name === name
          );
          const a = active[name];
          const elapsed = a
            ? Math.max(
                0,
                Math.round(
                  (Date.now() - new Date(a.start).getTime()) / 60000
                )
              )
            : 0;
          // tick used to recompute
          void tick;
          return (
            <EmployeeSection
              key={name}
              name={name}
              entries={employeeEntries}
              active={a}
              onStart={handleStart}
              onStop={handleStop}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              elapsed={elapsed}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EmpleadosPage;
