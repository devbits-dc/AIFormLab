'use client';
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Themes from "../../_data/Themes";
import GradientBg from "../../_data/GradientBg";
import { Button } from "../../../components/ui/button";
import Style from "../../_data/Style";
import { Checkbox } from "../../../components/ui/checkbox";


const Controller = ({ selectedTheme, selectedBackground, selectedStyle, setSignInEnabled }) => {
    const [showMore, setShowMore] = useState(6);
    return (
        <div>
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
                                        <div className="h-5 w-5 rounded-l-md" style={{ backgroundColor: theme.primary }}></div>
                                        <div className="h-5 w-5" style={{ backgroundColor: theme.secondary }}></div>
                                        <div className="h-5 w-5" style={{ backgroundColor: theme.accent }}></div>
                                        <div className="h-5 w-5 rounded-r-md" style={{ backgroundColor: theme.neutral }}></div>
                                    </div>
                                    <div>{theme.theme}</div>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            {/* Background selection controller */}
            <h2 className='mt-8 my-1'>Select Background</h2>
            <div className="grid grid-cols-3 gap-5">
                {GradientBg.map((bg, index) => index < showMore && (
                    <div
                        key={index}
                        className="w-full h-[70px] rounded-lg cursor-pointer hover:border-black hover:border-2 flex justify-center items-center"
                        style={{ background: bg.gradient }}
                        onClick={() => selectedBackground(bg.gradient)}
                    >
                        {index == 0 && 'None'}
                    </div>
                ))}
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
                                <img
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
            {/* for social auth check */}
            <div className="mt-10 flex items-center gap-2">
                <Checkbox onCheckedChange={(e) => setSignInEnabled(e)} /> <h2>Enable Social Authentication before submitting</h2>
            </div>
        </div>
    );
};

export default Controller;