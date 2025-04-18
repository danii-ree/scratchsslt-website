
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  className?: string;
}

export function PDFViewer({ className }: PDFViewerProps) {
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // This is a placeholder. In a real implementation, you would use a PDF library 
  // like pdf.js to render the actual PDF. For this prototype, we'll simulate with an image.
  const totalPages = 3;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  useEffect(() => {
    // This would normally scrollTo the top when changing pages
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className={cn("flex flex-col h-full border rounded-md overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-muted p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider 
            className="w-24" 
            value={[scale * 50]}
            min={25} 
            max={100} 
            step={5}
            onValueChange={(value) => setScale(value[0] / 50)}
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomIn}
            disabled={scale >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto bg-slate-100 p-4"
      >
        <div 
          className="mx-auto bg-white shadow-md transition-transform duration-200"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: '8.5in',
            minHeight: '11in',
            padding: '0.5in'
          }}
        >
          {currentPage === 1 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-center mb-6">The Curious Case of the Night Sky</h1>
              <p className="text-justify">
                Maria stood on the balcony of her apartment, gazing up at the night sky. It was unusual for the stars to be so visible in the city, but tonight they shone with exceptional clarity. The light pollution that typically obscured the celestial display had somehow diminished, revealing a tapestry of twinkling lights against the dark canvas above.
              </p>
              <p className="text-justify">
                She had lived in this apartment for five years, but had never witnessed such a spectacular view. The buildings across the street, normally illuminated by harsh fluorescent lighting, were eerily dark. In fact, as Maria looked around, she realized that much of the city seemed to be experiencing a power outage.
              </p>
              <p className="text-justify">
                "That explains it," she murmured to herself, pulling her phone from her pocket to check the local news. No service. Strange, but not entirely unexpected during an outage. She decided to turn on her battery-powered radio to see if there were any announcements about the situation.
              </p>
              <p className="text-justify">
                As she turned to go back inside, a movement in the sky caught her attention. What she had initially mistaken for a particularly bright star was moving—slowly but deliberately—across the night sky. It was too slow for a shooting star and followed too precise a path to be an airplane.
              </p>
              <p className="text-justify">
                The mysterious light grew larger, suggesting it was getting closer. Maria felt a mixture of curiosity and apprehension. Was this some kind of drone? A helicopter with an unusually bright searchlight? Or something altogether different?
              </p>
            </div>
          )}
          
          {currentPage === 2 && (
            <div className="space-y-4">
              <p className="text-justify">
                The light continued its approach, now large enough that Maria could discern a definite shape: circular, with a soft, pulsating glow that shifted between blue and white. As it drew nearer, she noticed smaller lights around its perimeter, blinking in a sequence that seemed almost... intentional.
              </p>
              <p className="text-justify">
                Maria's heart raced. She had always been fascinated by stories of unexplained phenomena, but had maintained a healthy skepticism. Yet here she was, witnessing something that defied conventional explanation. She wished she had her camera, but it was charging inside, and she dared not look away for fear the object would disappear.
              </p>
              <p className="text-justify">
                A soft humming sound began to fill the air, barely perceptible at first, but growing in intensity as the object approached. It wasn't unpleasant—more like a musical note held at perfect pitch. Maria found herself transfixed, unable to move or call out.
              </p>
              <p className="text-justify">
                The object hovered about a hundred feet above the building across the street. From this distance, Maria could see that it was metallic, reflecting the limited light from the moon and stars. Its surface appeared smooth, without seams or windows, yet she couldn't shake the feeling that she was being observed.
              </p>
              <p className="text-justify">
                Suddenly, a beam of light, different from the pulsating glow of the craft itself, shot down toward the street below. It was a concentrated beam, like a spotlight, illuminating a circular area about ten feet in diameter on the empty road. The humming changed pitch, becoming lower, more resonant.
              </p>
              <p className="text-justify">
                Maria held her breath. Was she about to witness a scene from a science fiction movie? Would something—or someone—descend from the craft? She gripped the balcony railing, her knuckles turning white with anticipation.
              </p>
            </div>
          )}
          
          {currentPage === 3 && (
            <div className="space-y-4">
              <p className="text-justify">
                The beam of light remained steady for several long moments, then, without warning, it extinguished. The humming ceased abruptly, plunging the area into silence so profound that Maria could hear her own heartbeat.
              </p>
              <p className="text-justify">
                The object remained motionless for a few more seconds, then began to move again—not away, as Maria had expected, but toward her building. Her breath caught in her throat as the craft approached, stopping directly in front of her balcony, seeming to hover at the same level.
              </p>
              <p className="text-justify">
                From this proximity, the craft was magnificent—a perfect disc about thirty feet in diameter, with surfaces that seemed to shift and shimmer despite the apparent solidity of the structure. The perimeter lights continued their sequential pattern, now clearly visible as a series of colored indicators: red, green, blue, yellow, repeating.
              </p>
              <p className="text-justify">
                A section of the craft's underside began to change, the seamless surface appearing to liquify and then reshape itself. An opening formed—not a door or hatch as Maria might have expected, but an aperture that seemed to be an extension of the craft itself, organic in its movement.
              </p>
              <p className="text-justify">
                Light spilled from the opening—warm, golden light that was markedly different from the blue-white glow of the exterior. And within that light, Maria could see a silhouette. A figure stood at the threshold of the opening, backlit so that details were obscured. But the outline was unmistakably humanoid—two arms, two legs, a head atop a torso.
              </p>
              <p className="text-justify">
                Maria's scientific mind raced with possibilities. Was this a government experiment? An elaborate hoax? Or was she truly in the presence of something beyond human understanding? Whatever the answer, she knew that this moment would change everything—her perception of reality, her understanding of humanity's place in the universe, and perhaps the course of her own life.
              </p>
              <p className="text-justify">
                The figure raised an arm in what appeared to be a gesture of greeting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
