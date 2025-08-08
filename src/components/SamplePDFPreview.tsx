import { ScrollArea } from "@/components/ui/scroll-area";

// This component shows a styled text preview similar to a PDF for the demo content
export function SamplePDFPreview() {
  // The passage from the demo content
  const passage = `Maria couldn't sleep that night. The summer heat was unbearable in her apartment, so she stepped out onto her small balcony hoping to catch a breeze. What she noticed immediately made her pause - she could see stars. Living in the city, this was unusual; the light pollution typically obscured all but the brightest celestial objects.

She realized there must be a power outage affecting her part of the city. The darkness stretched for several blocks in all directions, a rare moment of respite from the constant urban glow.

As she leaned against the railing, letting her eyes adjust to the darkness, something caught her attention. A light, different from the distant stars, moved across the sky. At first, she thought it was an airplane, but it wasn't blinking. Then she considered it might be a shooting star, but it moved too slowly, its trajectory too precise.

The light paused, hovering in place. Maria felt her heart beat faster. Whatever this was, it didn't behave like anything she'd seen before. The object began to descend, gradually at first, then picking up speed.

To her astonishment, it came to rest in the small park just two blocks from her apartment building. From her vantage point, she could make out a craft of some kind, its exterior pulsating with a soft, bluish glow.

Curiosity overwhelmed her fear. Maria quickly slipped on her shoes and hurried down the stairs and out into the street. As she approached the park, she heard a humming sound, like a musical note held at perfect pitch.

The craft, now clearly visible, was unlike any aircraft she had ever seen. It had no visible windows or doors, just a smooth, metallic surface that seemed to shimmer with an inner light. Around its perimeter, lights blinked in sequence: red, green, blue, yellow.

Just as she reached the edge of the park, a seam appeared in the craft's surface. It widened, revealing a warm, golden light from within. And then, silhouetted against that glow, a figure emerged.

Maria knew in that moment that her life would never be the same.`;

  // Format the passage into paragraphs
  const paragraphs = passage.split('\n\n');

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">The Curious Case of the Night Sky</h3>
          <p className="text-xs text-gray-500">Reading practice</p>
        </div>
        <div className="flex space-x-2">
          <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
            Download
          </button>
          <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
            Print
          </button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-8 bg-white">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">The Curious Case of the Night Sky</h1>
          
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-justify leading-relaxed">
              {paragraph}
            </p>
          ))}
          
          <div className="mt-8 mb-4 border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">© 2024 OSSLT Practice Platform</p>
            <p className="text-xs text-gray-400">This is sample content for educational purposes only.</p>
          </div>
        </div>
      </ScrollArea>
      
      <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
        <div className="text-xs text-gray-500">Page 1 of 1</div>
        <div className="flex space-x-2">
          <button disabled className="text-xs px-2 py-1 bg-white border rounded text-gray-400">
            Previous
          </button>
          <button disabled className="text-xs px-2 py-1 bg-white border rounded text-gray-400">
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 