import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import TextType from "@/components/TextType";

const PatternPlaceholder = () => {
  return (
    <div className="relative z-10">
      <div className="container py-28 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Badge variant="secondary">St. Luiz Cemetery and Wake Services</Badge>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-medium tracking-tight text-pretty text-foreground md:text-5xl lg:text-6xl">
              <TextType
                text={["Welcome Customer",
                     "Honoring Lives with Dignity, Compassion, and Care",
                      "Peaceful Resting Places, Heartfelt Memorial Services"," Thank you and God Bless!"
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
      </div>
    </div>
  );
};

export { PatternPlaceholder };
