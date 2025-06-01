import React, { useRef, useEffect, useState } from "react";

// Define the props for the EditableContent component
interface EditableContentProps {
  /** The HTML tag to render (e.g., 'p', 'div', 'span', 'h1'). Defaults to 'div'. */
  as?: keyof HTMLElementTagNameMap;
  /** The initial HTML content. */
  initialContent?: string;
  /** Callback fired when the content changes. Provides the new innerHTML. */
  onContentChange: (newContent: string) => void;
  /** Placeholder text to display when the element is empty. */
  placeholder?: string;
  /** Additional class names to apply to the component. */
  className?: string;
  /** Additional inline styles to apply to the component. */
  style?: React.CSSProperties;
  /** Boolean to allow or disallow editing. Defaults to true. */
  editable?: boolean;
  /** A ref to the underlying DOM element. */
  ref?: React.Ref<HTMLElement>; // Ref can now be passed as a normal prop!
}

// NOTE: With React 19's new ref behavior, we no longer need forwardRef.
// The component is now a regular functional component.
const EditableContent: React.FC<EditableContentProps> = ({
  as: Element = "div", // Default to 'div' if 'as' is not provided
  initialContent = "",
  onContentChange,
  placeholder = "Start writing...",
  className,
  style,
  editable = true,
  ref, // Ref is now simply destructured from props
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
    }
  }, [initialContent]);

  // Handle input events from the contenteditable element
  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setHasContent(newContent.length > 0);
    onContentChange(newContent);
  };

  console.log(hasContent);

  return (
    <>
      <Element
        // Now you directly pass the 'ref' prop (which is potentially null)
        // and also manage your internalRef in a combined callback.
        // ref={ref ? ref : internalRef}
        ref={(el) => {
          // Assign to internal ref
          (internalRef as React.MutableRefObject<HTMLElement | null>).current =
            el;

          // If a ref was passed from the parent, assign it as well
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
      {!hasContent && <span>ASADASD</span>}
    </>
  );
};

EditableContent.displayName = "EditableContent";

export default EditableContent;
