import { Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

const FieldEdit = ({ defaultValue, onUpdate, deleteField }) => {
  const [label, setLabel] = useState(defaultValue.label || "");
  const [placeholder, setPlaceholder] = useState(
    defaultValue.placeholder || ""
  );
  const [options, setOptions] = useState(defaultValue.options || []);
  const [isRequired, setIsRequired] = useState(defaultValue.required || false);

  // Handle updating an option (for select, radio, checkbox)
  const handleOptionChange = (index, newValue) => {
    const updatedOptions = [...options];
    updatedOptions[index].label = newValue;
    updatedOptions[index].value = newValue;
    setOptions(updatedOptions);
  };

  // Add a new option
  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]); // Add an empty option
  };

  // Remove an option
  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger>
          <Edit className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          <h2 className="font-semibold text-sm">Edit Field</h2>

          {/* Label Field (common for all) */}
          <div className="mt-2">
            <label className="text-xs">Label:</label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Placeholder Field (Only for Text Input) */}
          {defaultValue.fieldType === "text" && (
            <div className="mt-2">
              <label className="text-xs">Placeholder:</label>
              <Input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>
          )}

          {/* Options Field (Only for Select, Radio, Checkbox) */}
          {["radio", "checkbox", "select"].includes(defaultValue.fieldType) && (
            <div className="mt-2">
              <label className="text-xs">Options:</label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mt-1">
                  <Input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeOption(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button size="sm" className="mt-2" onClick={addOption}>
                + Add Option
              </Button>
            </div>
          )}

          {/* Required Checkbox */}
          <div className="mt-3 flex items-center gap-2">
            <Checkbox checked={isRequired} onCheckedChange={setIsRequired} />
            <span className="text-xs">Required</span>
          </div>

          {/* Update Button */}
          <Button
            size="sm"
            className="mt-3"
            onClick={() =>
              onUpdate({ label, placeholder, options, required: isRequired })
            }
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>

      {/* Delete Field Button */}
      <AlertDialog>
        <AlertDialogTrigger>
          <Trash className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              field.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteField()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FieldEdit;
