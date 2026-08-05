"use client";

import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const TOOLBAR_ITEMS = [
  {
    label: "Bold",
    icon: BoldIcon,
    isActive: (editor: Editor) => editor.isActive("bold"),
    run: (editor: Editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    icon: ItalicIcon,
    isActive: (editor: Editor) => editor.isActive("italic"),
    run: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Heading 1",
    icon: Heading1Icon,
    isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }),
    run: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    icon: Heading2Icon,
    isActive: (editor: Editor) => editor.isActive("heading", { level: 2 }),
    run: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Bullet list",
    icon: ListIcon,
    isActive: (editor: Editor) => editor.isActive("bulletList"),
    run: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered list",
    icon: ListOrderedIcon,
    isActive: (editor: Editor) => editor.isActive("orderedList"),
    run: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Quote",
    icon: QuoteIcon,
    isActive: (editor: Editor) => editor.isActive("blockquote"),
    run: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
  },
] as const;

export function DocEditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-2xl border border-b-0 border-border/60 bg-muted/40 p-1.5">
      {TOOLBAR_ITEMS.map(({ label, icon: Icon, isActive, run }) => (
        <Button
          key={label}
          type="button"
          variant="ghost"
          size="icon-sm"
          title={label}
          aria-label={label}
          aria-pressed={isActive(editor)}
          className={cn(isActive(editor) && "bg-accent text-accent-foreground")}
          onClick={() => run(editor)}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}
