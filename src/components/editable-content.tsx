import React, { useRef, useEffect, useState } from "react";

interface EditableContentProps {
  as?: keyof HTMLElementTagNameMap;
  initialContent?: string;
  onContentChange: (newContent: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  editable?: boolean;
  ref?: React.Ref<HTMLElement>;
}

const EditableContent: React.FC<EditableContentProps> = ({
  as: Element = "div",
  initialContent = "",
  onContentChange,
  placeholder = "Start writing...",
  className,
  style,
  editable = true,
  ref,
}) => {
  const internalRef = useRef<HTMLElement>(null);
  const [hasContent, setHasContent] = useState<boolean>(
    initialContent.length > 0,
  );

  useEffect(() => {
    if (
      internalRef.current &&
      internalRef.current.innerHTML !== initialContent
    ) {
      internalRef.current.innerHTML = initialContent;

      setHasContent((internalRef.current.textContent ?? "").length > 0);
    }
  }, [initialContent]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newContent = e.currentTarget.innerHTML;
    const textContent = e.currentTarget.textContent;

    setHasContent((textContent ?? "").length > 0);
    onContentChange(newContent);
  };

  return (
    <>
      <Element
        // @ts-expect-error FIX "Expression produces a union type that is too complex to represent"
        ref={(el: HTMLElement | null): void => {
          (internalRef as React.MutableRefObject<HTMLElement | null>).current =
            el;

          if (ref) {
            if (typeof ref === "function") {
              ref(el);
            } else {
              (ref as React.MutableRefObject<HTMLElement | null>).current = el;
            }
          }
        }}
        contentEditable={editable}
        onInput={handleInput}
        data-placeholder={!hasContent ? placeholder : undefined}
        className={`editable-content ${className || ""}`}
        style={style}
        suppressContentEditableWarning={true}
      />
    </>
  );
};

EditableContent.displayName = "EditableContent";

export default EditableContent;
