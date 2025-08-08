import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SamplePDFPreview } from "./SamplePDFPreview";

interface PDFViewerProps {
  documentId: string;
}

export function PDFViewer({ documentId }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // For demo purposes, if the document ID is a special value, use a placeholder
        if (documentId === "demo-document" || documentId === "featured-001") {
          setLoading(false);
          return;
        }

        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('file_url')
          .eq('id', documentId)
          .single();

        if (fetchError) throw fetchError;

        if (data && data.file_url) {
          // Get a temporary URL for the file
          const { data: urlData, error: urlError } = await supabase
            .storage
            .from('documents')
            .createSignedUrl(data.file_url, 3600); // URL valid for 1 hour

          if (urlError) throw urlError;
          
          setDocumentUrl(urlData.signedUrl);
        } else {
          throw new Error("Document file not found");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (loading) {
  return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <Loader2 className="h-8 w-8 animate-spin text-osslt-purple mb-4" />
        <p className="text-sm text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // For demo purposes, show the SamplePDFPreview instead of a real PDF
  if (documentId === "demo-document" || documentId === "featured-001" || !documentUrl) {
    return <SamplePDFPreview />;
  }

  // In a real implementation, we would use a PDF.js viewer or iframe to show the PDF
  return (
    <iframe 
      src={documentUrl} 
      className="w-full h-full border-0" 
      title="PDF Document Viewer"
    />
  );
}
