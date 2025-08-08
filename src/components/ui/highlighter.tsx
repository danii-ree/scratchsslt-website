import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Highlight {
  id: string;
  text: string;
  start: number;
  end: number;
}

interface HighlighterProps {
  text: string;
  highlights: Highlight[];
  onHighlight: (highlight: Highlight) => void;
  onRemoveHighlight: (id: string) => void;
}

export function Highlighter({
  text,
  highlights,
  onHighlight,
  onRemoveHighlight,
}: HighlighterProps) {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentMouseUp = () => {
      const documentSelection = window.getSelection();
      if (!documentSelection || documentSelection.isCollapsed) {
        setSelection(null);
        return;
      }

      // Only process selections within our component
      if (!containerRef.current?.contains(documentSelection.anchorNode)) {
        return;
      }

      const range = documentSelection.getRangeAt(0);
      const selectedText = range.toString().trim();

      if (selectedText) {
        // Find the offset in the original text
        const textBeforeSelection = text.substring(0, text.indexOf(selectedText));
        const start = textBeforeSelection.length;
        const end = start + selectedText.length;

        setSelection({ start, end });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [text]);

  const handleHighlightClick = () => {
    if (selection) {
      const newHighlight: Highlight = {
        id: uuidv4(),
        text: text.substring(selection.start, selection.end),
        start: selection.start,
        end: selection.end,
      };
      onHighlight(newHighlight);
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Convert the text and highlights into renderable content
  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      // If no highlights, just return the text with paragraph breaks
      return text.split('\n\n').map((paragraph, i) => (
        <p key={i} className="mb-4">{paragraph}</p>
      ));
    }

    // Sort highlights by starting position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    // Create segments of text: normal text and highlighted text
    const segments = [];
    let lastEnd = 0;

    for (const highlight of sortedHighlights) {
      // Add non-highlighted text before this highlight
      if (highlight.start > lastEnd) {
        const normalText = text.substring(lastEnd, highlight.start);
        segments.push({
          type: "normal",
          text: normalText,
          key: `normal-${lastEnd}`,
        });
      }

      // Add the highlighted text
      segments.push({
        type: "highlight",
        text: text.substring(highlight.start, highlight.end),
        id: highlight.id,
        key: `highlight-${highlight.id}`,
      });

      lastEnd = highlight.end;
    }

    // Add any remaining text after the last highlight
    if (lastEnd < text.length) {
      segments.push({
        type: "normal",
        text: text.substring(lastEnd),
        key: `normal-${lastEnd}`,
      });
    }

    // Convert segments into renderable content with paragraph breaks preserved
    let currentParagraph = [];
    const result = [];
    let paragraphIndex = 0;

    for (const segment of segments) {
      // Split segment by paragraph breaks
      const paragraphs = segment.text.split('\n\n');
      
      // Add first part to current paragraph
      if (paragraphs[0]) {
        currentParagraph.push(
          segment.type === "normal" ? (
            <span key={segment.key + "-0"}>{paragraphs[0]}</span>
          ) : (
            <span 
              key={segment.key + "-0"} 
              className="bg-yellow-200 px-0.5 rounded"
              onClick={() => onRemoveHighlight(segment.id)}
            >
              {paragraphs[0]}
            </span>
          )
        );
      }

      // For each additional paragraph, render the current one and start a new one
      for (let i = 1; i < paragraphs.length; i++) {
        result.push(
          <p key={`p-${paragraphIndex}`} className="mb-4">
            {currentParagraph}
          </p>
        );
        paragraphIndex++;
        
        currentParagraph = [
          segment.type === "normal" ? (
            <span key={segment.key + `-${i}`}>{paragraphs[i]}</span>
          ) : (
            <span 
              key={segment.key + `-${i}`} 
              className="bg-yellow-200 px-0.5 rounded"
              onClick={() => onRemoveHighlight(segment.id)}
            >
              {paragraphs[i]}
            </span>
          )
        ];
      }
    }

    // Add the last paragraph if there's anything in it
    if (currentParagraph.length > 0) {
      result.push(
        <p key={`p-${paragraphIndex}`} className="mb-4">
          {currentParagraph}
        </p>
      );
    }

    return result;
  };

  return (
    <div>
      <div ref={containerRef} className="relative">
        {renderHighlightedText()}
      </div>
      
      {selection && (
        <div className="fixed z-50 bg-white border shadow-lg rounded-lg p-2 mt-2">
          <button
            className="bg-yellow-200 hover:bg-yellow-300 text-sm px-3 py-1 rounded-full"
            onClick={handleHighlightClick}
          >
            Highlight
          </button>
        </div>
      )}
    </div>
  );
} 