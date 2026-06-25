"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Editor, JSONContent } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Bold,
  Heading3,
  Heading4,
  Heading5,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { richTextExtensions } from "./rich-text-shared";

type RichTextEditorProps = {
  value?: JSONContent | null;
  onChange?: (value: JSONContent) => void;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: richTextExtensions,
    content: value ?? null,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "typography min-h-40 max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        "border-input bg-background flex flex-col rounded-md border",
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="px-3 py-2" />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border-border flex flex-wrap items-center gap-1 border-b p-1">
      <ToolbarButton
        label="Gras"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italique"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Souligné"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Barré"
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        label="Titre 3"
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Titre 4"
        isActive={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Titre 5"
        isActive={editor.isActive("heading", { level: 5 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <Heading5 className="size-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarButton
        label="Liste à puces"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Liste numérotée"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Citation"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Séparateur"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <ToolbarSeparator />

      <LinkButton editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  isActive,
  onClick,
}: {
  children: ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant={isActive ? "secondary" : "ghost"}
      className="size-8"
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ToolbarSeparator() {
  return <span className="bg-border mx-1 h-5 w-px" aria-hidden="true" />;
}

function LinkButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const apply = () => {
    const href = url.trim();
    if (href === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setOpen(false);
    setUrl("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          const current = editor.getAttributes("link").href as
            | string
            | undefined;
          setUrl(current ?? "");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          className="size-8"
          aria-label="Lien"
          title="Lien"
        >
          <LinkIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-72 gap-2" align="start">
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://exemple.com"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              apply();
            }
          }}
        />
        <Button type="button" onClick={apply}>
          OK
        </Button>
      </PopoverContent>
    </Popover>
  );
}
