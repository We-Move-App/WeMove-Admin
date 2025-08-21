import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS = [
    "pending",
    "approved",
    "rejected",
    "submitted",
    "blocked",
    "active",
    "inactive",
] as const;

type Status = (typeof STATUS_OPTIONS)[number];

type StatusDropdownProps = {
    value: Status;
    onChange: (next: Status) => void;
};

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
        }
    }, [open]);

    // close on outside click
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!buttonRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm
                   hover:bg-gray-100 focus:outline-none"
            >
                <StatusBadge status={value || "pending"} />
                <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {open &&
                coords &&
                createPortal(
                    <div
                        className="absolute z-[9999] mt-1 min-w-[140px] rounded border bg-white p-1 shadow-lg"
                        style={{
                            top: coords.top,
                            left: coords.left,
                            width: coords.width,
                            position: "absolute",
                        }}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    console.log("✅ Sending status:", opt);
                                    onChange(opt);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm
                         hover:bg-gray-100 ${opt === value ? "bg-gray-50" : ""}`}
                            >
                                <StatusBadge status={opt} />
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
}
