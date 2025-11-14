import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import clsx from "clsx";
import axios from "axios";

export function AmenitiesMultiSelect({
  value = [],
  onChange,
  isReadOnly,
}: {
  value?: any[];
  onChange: (v: any[]) => void;
  isReadOnly?: boolean;
}) {
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await axios.get(
          "http://139.59.20.155:8000/api/v1/amenities"
        );

        let items: unknown = res?.data;
        if (items && typeof items === "object" && "data" in (items as any)) {
          items = (items as any).data;
        }

        if (items && typeof items === "object" && "data" in (items as any)) {
          items = (items as any).data;
        }

        if (!Array.isArray(items)) {
          setOptions([]);
          return;
        }

        const hotelAmenities = (items as any[])
          .filter(
            (item): item is { name: unknown; type: unknown } =>
              typeof item === "object" &&
              item !== null &&
              "type" in item &&
              "name" in item
          )
          .filter((item) => String(item.type).toLowerCase() === "hotel")
          .map((item) => String((item as any).name))
          .filter(Boolean);

        const uniqueAmenities = Array.from(new Set(hotelAmenities));
        setOptions(uniqueAmenities);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
        setOptions([]);
      }
    };

    fetchAmenities();
  }, []);

  const selectedNames: string[] = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value
      .map((v) => {
        if (v == null) return "";
        if (typeof v === "string") return v;
        if (typeof v === "object")
          return String((v as any).name ?? (v as any).value ?? "");
        return String(v);
      })
      .filter(Boolean);
  }, [value]);

  const toggleAmenity = (amenityName: string) => {
    const isSelected = selectedNames.includes(amenityName);

    if (value.length === 0 || typeof value[0] === "string") {
      const newVal = isSelected
        ? (value as string[]).filter((s) => s !== amenityName)
        : [...(value as string[]), amenityName];
      onChange(newVal);
      return;
    }

    if (typeof value[0] === "object") {
      const currentObjects = value as any[];
      if (isSelected) {
        onChange(
          currentObjects.filter(
            (obj) => String(obj.name ?? obj.value ?? "") !== amenityName
          )
        );
      } else {
        onChange([...currentObjects, { name: amenityName }]);
      }
      return;
    }

    const fallback = isSelected
      ? selectedNames.filter((s) => s !== amenityName)
      : [...selectedNames, amenityName];
    onChange(fallback);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={clsx(
            "w-full justify-between",
            isReadOnly && "opacity-100 cursor-default bg-gray-100"
          )}
          disabled={isReadOnly}
        >
          {selectedNames.length > 0
            ? selectedNames.join(", ")
            : "Select amenities"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search amenities..." />
          <CommandList>
            <CommandEmpty>No amenities found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(val) => toggleAmenity(val)}
                  className="cursor-pointer"
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4",
                      selectedNames.includes(option)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AmenitiesMultiSelect;
