import React, { useState, useEffect, useRef } from "react";
import { X, FileText } from "lucide-react";
import { Document } from "@/db/actions/documents/get";
import EditableContent from "@/components/editable-content";
import updateDocument from "@/db/actions/documents/update";
import debounce from "lodash.debounce";

export default function DocumentModal({
  document,
  documentVisible,
  setDocumentVisibility,
  space_id,
}: {
  document: Document;
  documentVisible: boolean;
  setDocumentVisibility: (state: boolean) => void;
  space_id: string;
}) {
  const [doc, setDocument] = useState<Document>(document);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateTitle = React.useCallback(
    debounce(
      (title: string) => updateDocument(doc.id, { title }, space_id),
      300,
    ),
    [doc.id, space_id],
  );

  const updateContent = React.useCallback(
    debounce((content: string) => {
      updateDocument(doc.id, { content }, space_id);
      setDocument((prev) => ({ ...prev, content }));
    }, 300),
    [doc.id, space_id],
  );

  useEffect(() => {
    setDocument(document);
  }, [document]);

  useEffect(() => {
    return () => {
      updateTitle.cancel();
      updateContent.cancel();
    };
  }, [updateTitle, updateContent]);

  if (!documentVisible) return;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-20 backdrop-blur-sm"
      onClick={() => setDocumentVisibility(false)}
    >
      <div
        className="bg-background rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <button
            onClick={() => setDocumentVisibility(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="mb-2">
              <EditableContent
                as="h2"
                initialContent={document.title ?? ""}
                onContentChange={updateTitle}
              />
            </div>

            <div className="mb-4">
              <EditableContent
                initialContent={document.content ?? ""}
                onContentChange={(content) => {
                  updateContent(content);

                  setDocument((prev) => ({
                    ...prev,
                    content: contentRef.current!.textContent,
                  }));
                }}
                ref={contentRef}
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>{doc.content?.length ?? 0} characters</span>
              <span>
                {doc.content?.split(/\s+/).filter((word) => word.length > 0)
                  .length ?? 0}{" "}
                words
              </span>
            </div>
            <div>Last edited now</div>
          </div>
        </div>
      </div>
    </div>
  );
}
