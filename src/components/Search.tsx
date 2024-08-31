import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function Search({
  value,
  onChange,
  defaultValue,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue: string;
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute top-[8px] left-1" />

      <Input
        type="text"
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder="Search"
        className="pl-8 text-dark"
      />
    </div>
  );
}
