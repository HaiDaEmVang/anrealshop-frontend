import { Text } from '@mantine/core';
import {
    Link,
    RichTextEditor as MantineRTE,
} from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  minHeight?: number | string;
  stickyOffset?: number;
  withToolbarBorder?: boolean;
  includeControls?: {
    formatting?: boolean;
    headings?: boolean;
    lists?: boolean;
    alignment?: boolean;
    links?: boolean;
  };
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RichTextEditor = ({
  value,
  onChange,
  label,
  description,
  error,
  minHeight = 200,
  stickyOffset = 60,
  includeControls = {
    formatting: true,
    headings: true,
    lists: true,
    alignment: true,
    links: true,
  },
  readOnly = false,
  className,
  style,
}: RichTextEditorProps) => {
  const lastValue = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '<p></p>',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        const html = editor.getHTML();
        if (html !== lastValue.current) {
          lastValue.current = html;
          onChange(html);
        }
      }
    },
  });

  // Sync editor editable state with readOnly
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  // Sync editor content with prop value (external update)
  useEffect(() => {
    if (editor && value !== lastValue.current) {
      editor.commands.setContent(value || '<p></p>');
      lastValue.current = value;
    }
  }, [value, editor]);

  return (
    <div className={className} style={style}>
      {label && (
        <Text component="label" size="sm" fw={500} mb={3} display="block">
          {label}
        </Text>
      )}

      <MantineRTE key={readOnly ? 'readonly' : 'editable'} editor={editor}>
        {!readOnly && (
          <MantineRTE.Toolbar
            sticky
            stickyOffset={stickyOffset}
          >
            {includeControls.formatting && (
              <MantineRTE.ControlsGroup>
                <MantineRTE.Bold title="Đậm" />
                <MantineRTE.Italic title="Nghiêng" />
                <MantineRTE.Underline title="Gạch chân" />
                <MantineRTE.Strikethrough title="Gạch ngang" />
                <MantineRTE.Highlight title="Đánh dấu" />
                <MantineRTE.ClearFormatting title="Xóa định dạng" />
              </MantineRTE.ControlsGroup>
            )}

            {includeControls.headings && (
              <MantineRTE.ControlsGroup>
                <MantineRTE.H1 title="Tiêu đề 1" />
                <MantineRTE.H2 title="Tiêu đề 2" />
                <MantineRTE.H3 title="Tiêu đề 3" />
              </MantineRTE.ControlsGroup>
            )}

            {includeControls.lists && (
              <MantineRTE.ControlsGroup>
                <MantineRTE.BulletList title="Danh sách" />
                <MantineRTE.OrderedList title="Danh sách có thứ tự" />
              </MantineRTE.ControlsGroup>
            )}

            {includeControls.links && (
              <MantineRTE.ControlsGroup>
                <MantineRTE.Link title="Thêm liên kết" />
                <MantineRTE.Unlink title="Xóa liên kết" />
              </MantineRTE.ControlsGroup>
            )}

            {includeControls.alignment && (
              <MantineRTE.ControlsGroup>
                <MantineRTE.AlignLeft title="Căn trái" />
                <MantineRTE.AlignCenter title="Căn giữa" />
                <MantineRTE.AlignRight title="Căn phải" />
                <MantineRTE.AlignJustify title="Căn đều" />
              </MantineRTE.ControlsGroup>
            )}
          </MantineRTE.Toolbar>
        )}

        <MantineRTE.Content
          style={{
            minHeight: minHeight,
            ...(readOnly
              ? {
                  pointerEvents: 'none',
                  opacity: 0.9,
                  backgroundColor: '#f9f9f9',
                }
              : {}),
          }}
        //   placeholder={placeholder}
        />
      </MantineRTE>

      {error && (
        <Text size="xs" c="red" mt={5}>
          {error}
        </Text>
      )}

      {description && !error && (
        <Text size="xs" c="dimmed" mt={5}>
          {description}
        </Text>
      )}
    </div>
  );
};

export default RichTextEditor;
