import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import clsx from "clsx";
import axios from "axios";

export function AmenitiesMultiSelect({ value = [], onChange, isReadOnly }) {
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const res = await axios.get("http://139.59.20.155:8000/api/v1/amenities");
                // Filter hotel amenities & get unique names
                const hotelAmenities = res.data?.data
                    ?.filter((item) => item.type === "hotel")
                    ?.map((item) => item.name);

                // Remove duplicates (API has "Free Wi-Fi" twice in hotel+bus)
                const uniqueAmenities = [...new Set(hotelAmenities)];

                setOptions(uniqueAmenities);
            } catch (error) {
                console.error("Failed to fetch amenities:", error);
            }
        };
        fetchAmenities();
    }, []);

    const toggleAmenity = (amenity) => {
        if (value.includes(amenity)) {
            onChange(value.filter((item) => item !== amenity));
        } else {
            onChange([...value, amenity]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={isReadOnly}
                >
                    {value.length > 0 ? value.join(", ") : "Select amenities"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search amenities..." />
                    <CommandEmpty>No amenities found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option}
                                onSelect={() => toggleAmenity(option)}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={clsx(
                                        "mr-2 h-4 w-4",
                                        value.includes(option) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default AmenitiesMultiSelect;