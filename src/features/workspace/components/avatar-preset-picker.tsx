"use client";

import { ShuffleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  WORKSPACE_AVATAR_PRESETS,
  getWorkspaceAvatarGradient,
} from "../constants/avatar-presets";

interface AvatarPresetPickerProps {
  value?: { emoji: string; color: string };
  onChange: (preset: { emoji: string; color: string } | undefined) => void;
}

export function AvatarPresetPicker({ value, onChange }: AvatarPresetPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Workspace icon</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => onChange(undefined)}
        >
          <ShuffleIcon className="size-3.5" />
          Randomize
        </Button>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {WORKSPACE_AVATAR_PRESETS.map((preset) => {
          const isSelected = value?.emoji === preset.emoji && value.color === preset.color;
          return (
            <button
              key={`${preset.emoji}-${preset.color}`}
              type="button"
              onClick={() => onChange(preset)}
              aria-pressed={isSelected}
              className={`flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br text-lg transition-all ${getWorkspaceAvatarGradient(
                preset.color,
              )} ${
                isSelected
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {preset.emoji}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Pick an icon, or leave it blank to get a random one.
      </p>
    </div>
  );
}
