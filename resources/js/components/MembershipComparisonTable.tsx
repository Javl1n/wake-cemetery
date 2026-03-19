import { Check, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    category: "Content",
    items: [
      {
        name: "1189+ Shadcn Components",
        description: "Pre-built React components ready to use",
        pro: true,
        premium: true,
      },
      {
        name: "1248+ Shadcn Blocks",
        description: "Our flagship product, hundreds of Premium shadcn/ui blocks",
        pro: true,
        premium: true,
      },
      {
        name: "13 Shadcn Templates",
        description: "Next.js & Astro multi-page marketing templates built with shadcn/ui.",
        pro: false,
        premium: true,
      },
      {
        name: "Shadcn Figma Kit",
        description:
          "Figma Kit with shadcn ui base components and 479 block designs (and growing each month)",
        pro: false,
        premium: true,
      },
      {
        name: "Admin Kit",
        description: "Our premium admin dashboard kit",
        pro: false,
        premium: true,
      },
      {
        name: "CMS Addons",
        description: "Additional CMS integrations and addons",
        pro: false,
        premium: false,
        addon: true,
      },
    ],
  },
  {
    category: "Access & Support",
    items: [
      {
        name: "Lifetime Updates",
        description: "Get all future updates for free",
        pro: true,
        premium: true,
      },
      {
        name: "Priority Support",
        description: "Direct access to our support team",
        pro: false,
        premium: true,
      },
      {
        name: "Commercial License",
        description: "Use in unlimited client projects",
        pro: true,
        premium: true,
      },
    ],
  },
];

function FeatureCell({ value, addon }: { value: boolean; addon?: boolean }) {
  if (addon) {
    return (
      <div className="flex items-center justify-center">
        <X className="w-5 h-5 text-red-500" strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      {value ? (
        <Check className="w-5 h-5 text-green-500" strokeWidth={2.5} />
      ) : (
        <X className="w-5 h-5 text-red-400" strokeWidth={2.5} />
      )}
    </div>
  );
}

export function MembershipComparisonTable() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-[1fr_140px_140px] border-b border-border">
        <div className="px-6 py-5">
          <p className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">
            Feature
          </p>
        </div>
        <div className="px-4 py-5 flex flex-col items-center justify-center border-l border-border gap-1">
          <p className="text-sm font-bold text-foreground">Pro</p>
        </div>
        <div className="px-4 py-5 flex flex-col items-center justify-center border-l border-border gap-1 bg-primary/5">
          <Badge variant="outline" className="text-[10px] mb-1 border-primary text-primary px-2">
            Popular
          </Badge>
          <p className="text-sm font-bold text-foreground">Premium</p>
        </div>
      </div>

      {/* Feature Groups */}
      {features.map((group) => (
        <div key={group.category}>
          {/* Category Header */}
          <div className="grid grid-cols-[1fr_140px_140px] border-b border-border bg-muted/40">
            <div className="px-6 py-3">
              <p className="text-sm font-semibold text-foreground/70">{group.category}</p>
            </div>
            <div className="border-l border-border" />
            <div className="border-l border-border bg-primary/5" />
          </div>

          {/* Feature Rows */}
          {group.items.map((feature, idx) => (
            <div
              key={feature.name}
              className={cn(
                "grid grid-cols-[1fr_140px_140px] border-b border-border last:border-b-0 transition-colors hover:bg-muted/30",
              )}
            >
              {/* Feature Name */}
              <div className="px-6 py-4 flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">{feature.name}</p>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  {feature.description}
                </p>
                {feature.addon && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-fit h-7 text-xs gap-1.5 rounded-lg"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Purchase addons
                  </Button>
                )}
              </div>

              {/* Pro */}
              <div className="flex items-center justify-center border-l border-border px-4 py-4">
                <FeatureCell value={feature.pro} addon={feature.addon} />
              </div>

              {/* Premium */}
              <div className="flex items-center justify-center border-l border-border px-4 py-4 bg-primary/5">
                <FeatureCell value={feature.premium} addon={feature.addon} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
