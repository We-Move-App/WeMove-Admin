import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface Branch {
  _id: string;
  name: string;
  location: string;
}

interface BranchSelectProps {
  value: string | undefined;
  onChange: (id: string) => void;
}

const BranchSelect: React.FC<BranchSelectProps> = ({ value, onChange }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get("/branch/all");
        console.log("🔥 Branch API response:", res.data);
        setBranches(res.data?.data?.branches || []);
      } catch (err) {
        console.error("Error fetching branches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="space-y-2">
      <Select
        value={value}
        disabled={loading}
        onValueChange={(id) => {
          console.log("Selected Branch ID:", id);
          onChange(id);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("commonBranch.selectBranch")} />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch._id} value={branch._id}>
              {branch.name} ({branch.location})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelect;
