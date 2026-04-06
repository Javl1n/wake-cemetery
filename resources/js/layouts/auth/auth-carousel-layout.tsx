import AppLogoIcon from "@/components/app-logo-icon";
import RotatingText from "@/components/RotatingText";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { home } from "@/routes";
import { AuthLayoutProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";

const slides = [
    { id: 1, image: "/system/images/1.png" },
    { id: 2, image: "/system/images/2.png" },
    { id: 3, image: "/system/images/3.png" },
    { id: 4, image: "/system/images/4.jpg" },
    { id: 5, image: "/system/images/5.png" },
];

export default function AuthCarouselLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const handleApiChange = (newApi: CarouselApi) => {
        setApi(newApi);
        if (newApi) {
            setCurrent(newApi.selectedScrollSnap());
            newApi.on("select", () => {
                setCurrent(newApi.selectedScrollSnap());
            });
        }
    };

    const autoSlide = useCallback(() => {
        if (!api) return;
        const next = (api.selectedScrollSnap() + 1) % slides.length;
        api.scrollTo(next);
    }, [api]);

    useEffect(() => {
        const interval = setInterval(autoSlide, 3000);
        return () => clearInterval(interval);
    }, [autoSlide]);

    return (
        <div className="grid lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10 max-h-screen overflow-scroll">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-lg">
                        {children}
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-muted lg:block h-full min-h-svh">
                <Carousel
                    setApi={handleApiChange}
                    className="w-full h-full [&>div]:h-full [&>div>div]:h-full"
                >
                    <CarouselContent className="h-full">
                        {slides.map((slide) => (
                            <CarouselItem key={slide.id} className="h-full">
                                <div className="h-full w-full overflow-hidden">
                                    <img
                                        src={slide.image}
                                        alt={`Slide ${slide.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 px-4">
                    <div className="bg-transparent min-w-150 min-h-30 justify-center backdrop-blur-xs rounded-xl px-5 py-2 flex flex-col items-center gap-1">
                        <h2 className="text-2xl font-semibold text-foreground">
                            St. Luiz Wake Services & Cemetery
                        </h2>
                        <div className="flex items-center gap-2 text-2xl text-muted-foreground">
                            <span>Providing</span>
                            <RotatingText
                                texts={['Wake Services', 'Burial Plots', 'Memorial Care', 'Grief Support']}
                                mainClassName="px-2 bg-primary min-w-44 min-h-10 text-white overflow-hidden py-1 justify-center rounded-md"
                                staggerFrom={"last"}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.025}
                                splitLevelClassName="overflow-hidden pb-0.5"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                            <span>with dignity & care.</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => api?.scrollTo(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${current === index
                                    ? "w-6 bg-primary"
                                    : "w-2.5 bg-primary/30 hover:bg-primary/60"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );

}
