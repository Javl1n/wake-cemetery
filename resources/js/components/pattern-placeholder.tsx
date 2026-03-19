import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import TextType from "@/components/TextType";

const scrollToSection = () => {
    const section = document.getElementById("next-section");
    if (!section) return;

    const targetY = section.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 800; // ms
    let startTime: number | null = null;

    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut

    const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
};
const PatternPlaceholder = () => {
  return (
    <div className="relative z-10">
      <div className="container py-28 md:py-22">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Badge variant="secondary">St. Luiz Cemetery and Wake Services</Badge>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-medium tracking-tight text-pretty text-foreground md:text-5xl lg:text-6xl">
              <TextType
                text={["Welcome Customer",
                     "Honoring Lives with Dignity"," Compassion, and Care",
                      "Peaceful Resting Places","Heartfelt Memorial Services"
                    ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={false}
                cursorCharacter="|"
            />
            </h1>

            <p className="mx-auto max-w-2xl font-light tracking-tighter text-pretty text-muted-foreground md:text-lg lg:text-xl">
                At St. Luiz Cemetery and Wake Services, we provide peaceful resting
                places and heartfelt memorial services that celebrate life and legacy.
                Our dedicated team supports families with professionalism, empathy, and
                respect—guiding you through every step with care and understanding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => router.visit('/register')}>Get Started</Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
        <div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <Button
                variant="outline"
                size="icon"
                onClick={scrollToSection}
                aria-label="Scroll down"
                className="animate-bounce rounded-full border-2 border-primary h-14 w-14 hover:bg-primary/10">
                    <ChevronDown className="h-10 w-10 text-primary" />
            </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export { PatternPlaceholder };
