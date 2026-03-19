import { cn } from "@/lib/utils";
import { PatternPlaceholder } from "@/components/pattern-placeholder";
import LightRays from "@/components/LightRays";
import FadeContent from "@/components/FadeContent";

interface BackgroundPattern2Props {
  className?: string;
}

const BackgroundPattern2 = ({ className }: BackgroundPattern2Props) => {
  return (
    <div className={cn("relative flex h-full items-center justify-center", className)}>
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#0000"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      <div className="relative z-10 container py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
            <FadeContent blur={true} duration={1500} initialOpacity={0}>
                <PatternPlaceholder />
            </FadeContent>
        </div>
      </div>
    </div>
  );
};

export { BackgroundPattern2 };
