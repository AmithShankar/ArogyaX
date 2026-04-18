"use client";

import { ClinicalGrid } from "@/components/ui/ClinicalGrid";
import { EcgLine } from "@/components/ui/EcgLine";

export function LoginBackground() {
  return (
    <>
      <ClinicalGrid size={80} id="medical-grid-hero" className="opacity-[0.05] dark:opacity-[0.1]" />

      <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/30 rounded-full blur-[100px]" />

      <div
        className="absolute top-1/2 left-0 right-0 h-40 -translate-y-1/2 z-0 pointer-events-none opacity-[0.38] dark:opacity-[0.32]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <EcgLine speed={85} />
      </div>
    </>
  );
}
