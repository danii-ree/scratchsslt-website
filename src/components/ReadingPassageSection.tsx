import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Highlighter, Highlight } from "@/components/ui/highlighter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TextSelection, 
  BookOpen, 
  AlignLeft, 
  Pencil, 
  Lightbulb,
  Volume2 
} from "lucide-react";

interface ReadingPassageSectionProps {
  passage: string;
}

export function ReadingPassageSection({ passage }: ReadingPassageSectionProps) {
  const [activeHighlights, setActiveHighlights] = useState<Highlight[]>([]);
  const [mode, setMode] = useState<'read' | 'highlight' | 'notes' | 'vocab'>('read');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const handleHighlight = (highlight: Highlight) => {
    setActiveHighlights((prev) => [...prev, highlight]);
  };

  const handleRemoveHighlight = (id: string) => {
    setActiveHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // The ReadingToolbar component
  const ReadingToolbar = () => (
    <div className="flex justify-between items-center mb-3 pb-2 border-b">
      <div className="flex space-x-1">
        <Button
          variant={mode === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('read')}
          className="flex items-center gap-1 h-8 px-2 text-xs"
        >
          <BookOpen className="h-3 w-3" />
          <span>Read</span>
        </Button>
        <Button
          variant={mode === 'highlight' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('highlight')}
          className="flex items-center gap-1 h-8 px-2 text-xs"
        >
          <TextSelection className="h-3 w-3" />
          <span>Highlight</span>
        </Button>
        <Button
          variant={mode === 'notes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('notes')}
          className="flex items-center gap-1 h-8 px-2 text-xs"
        >
          <Pencil className="h-3 w-3" />
          <span>Notes</span>
        </Button>
        <Button
          variant={mode === 'vocab' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('vocab')}
          className="flex items-center gap-1 h-8 px-2 text-xs"
        >
          <Lightbulb className="h-3 w-3" />
          <span>Vocab</span>
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFontSize('normal')}
          className={`h-7 w-7 p-0 ${fontSize === 'normal' ? 'bg-muted' : ''}`}
        >
          <AlignLeft className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFontSize('large')}
          className={`h-7 w-7 p-0 ${fontSize === 'large' ? 'bg-muted' : ''}`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFontSize('larger')}
          className={`h-7 w-7 p-0 ${fontSize === 'larger' ? 'bg-muted' : ''}`}
        >
          <AlignLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  // Format passage paragraphs
  const paragraphs = passage.split('\n\n');

  return (
    <div>
      <ReadingToolbar />
      <ScrollArea className="h-[450px] pr-2">
        <div 
          className={`prose dark:prose-invert max-w-none ${
            fontSize === 'large' 
              ? 'text-lg' 
              : fontSize === 'larger' 
                ? 'text-xl' 
                : 'text-sm'
          }`}
        >
          {mode === 'highlight' ? (
            <Highlighter
              text={passage}
              highlights={activeHighlights}
              onHighlight={handleHighlight}
              onRemoveHighlight={handleRemoveHighlight}
            />
          ) : (
            <>
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
      {activeHighlights.length > 0 && (
        <div className="mt-3 pt-2 border-t">
          <h3 className="text-sm font-medium mb-1">My Highlights</h3>
          <div className="space-y-1">
            {activeHighlights.map((highlight) => (
              <div key={highlight.id} className="flex items-start gap-1">
                <Badge variant="outline" className="bg-yellow-50 text-xs">
                  Highlight
                </Badge>
                <p className="text-xs">"{highlight.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 