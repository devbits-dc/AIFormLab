"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Themes from "../../../_data/Themes";
import GradientBg from "../../../_data/GradientBg";
import Style from "../../../_data/Style";
import Fields from "../../../_data/Fields";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

const Controller = ({
  selectedTheme,
  selectedBackground,
  selectedStyle,
  setSignInEnabled,
  addField,
  isTemplate,
  setIsTemplate,
  isActive,
  setIsActive,
}) => {
  const [showMore, setShowMore] = useState(6);
  const [fields, setFields] = useState([]);

  const toCamelCase = (str) => {
    return str
      .replace(/\s(.)/g, (match) => match.toUpperCase()) // Capitalize letters after spaces
      .replace(/\s/g, "") // Remove spaces
      .replace(/^./, (match) => match.toLowerCase()); // Lowercase the first letter
  };

  // Add new field
  const addNewField = (type) => {
    addField({
      fieldName: toCamelCase("enter your label"),
      fieldTitle: "enter your label",
      fieldType: type,
      label: "enter your label",
      options:
        type !== "text" && type !== "file"
          ? [
              { value: "Option 1", label: "Option 1" },
              { value: "Option 2", label: "Option 2" },
            ]
          : null,
      placeholder: type === "text" ? "enter your placholder" : null,
    });
  };

  return (
    <div className="hidden md:block bg-muted/20 p-6 rounded-xl border h-fit">
      {/* theme selection controller */}
      <h2 className="my-1">Select Theme</h2>
      <Select onValueChange={(value) => selectedTheme(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Themes.map((theme, index) => {
            return (
              <SelectItem key={index} value={theme.theme}>
                <div className="flex gap-3">
                  <div className="flex">
                    <div
                      className="h-5 w-5 rounded-l-md"
                      style={{ backgroundColor: theme.primary }}
                    ></div>
                    <div
                      className="h-5 w-5"
                      style={{ backgroundColor: theme.secondary }}
                    ></div>
                    <div
                      className="h-5 w-5"
                      style={{ backgroundColor: theme.accent }}
                    ></div>
                    <div
                      className="h-5 w-5 rounded-r-md"
                      style={{ backgroundColor: theme.neutral }}
                    ></div>
                  </div>
                  <div>{theme.theme}</div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {/* Background selection controller */}
      <h2 className="mt-8 my-1">Select Background</h2>
      <div className="grid grid-cols-3 gap-5">
        {GradientBg.map(
          (bg, index) =>
            index < showMore && (
              <div
                key={index}
                className="w-full h-[70px] rounded-lg cursor-pointer hover:border-black hover:border-2 flex justify-center items-center"
                style={{ background: bg.gradient }}
                onClick={() => selectedBackground(bg.gradient)}
              >
                {index == 0 && "None"}
              </div>
            )
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-4"
        onClick={() => setShowMore(showMore > 6 ? 6 : 20)}
      >
        {" "}
        {showMore > 6 ? "Less" : "Show More"}
      </Button>
      {/* Style selection controller */}
      <div className="mt-8">
        <h2 className="mt-8 my-1">Select Style</h2>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {Style.map((style, index) => (
            <div key={index}>
              <div
                className="cursor-pointer hover:border-2 rouneded-lg border-black"
                onClick={() => selectedStyle(style)}
              >
                <Image
                  src={style.img}
                  alt={style.name}
                  width={600}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-center">{style.name}</h2>
            </div>
          ))}
        </div>
      </div>
      {/* Add Fields Section */}
      <div className="mt-8">
        <h2 className="my-2">Add Fields</h2>
        <div className="flex flex-wrap gap-3">
          {Fields.map(({ id, icon: Icon, title }) => (
            <div
              key={id}
              onClick={() => addNewField(id)}
              className="flex flex-col items-center justify-center py-3 px-4 gap-[2px] border-border cursor-pointer bg-background rounded-lg"
            >
              <Icon className="w-6 h-6" />
              {title}
            </div>
          ))}
        </div>
      </div>
<div className="mt-10 flex flex-col gap-4">
  {/* Template Controller */}
  <div className="flex items-center gap-2">
    <div className="flex flex-col gap-[2px]">
      <h2 className="text-base font-medium break-words">Make Public Template</h2>
      <p className="text-muted-foreground text-sm break-words">
        Allow others to use this as a starting point while keeping your original content unchanged.
      </p>
    </div>
    <Switch checked={isTemplate} onCheckedChange={() => setIsTemplate(prev => !prev)} />
  </div>

  {/* Deactivate Form Switch */}
  <div className="flex items-center gap-2">
    <div className="flex flex-col gap-[2px]">
      <h2 className="text-base font-medium break-words">Deactivate Form</h2>
      <p className="text-muted-foreground text-sm break-words">
        Disable this form to prevent new submissions while keeping data intact.
      </p>
    </div>
    <Switch checked={!isActive} onCheckedChange={() => setIsActive(prev => !prev)} />
  </div>
</div>



      {/* for social auth check */}
      <div className="mt-10 flex items-center gap-2">
        <Checkbox onCheckedChange={(e) => setSignInEnabled(e)} />
        <h2>Enable Social Authentication before submitting</h2>
      </div>
    </div>
  );
};

export default Controller;
