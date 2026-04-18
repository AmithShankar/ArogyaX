"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/app-config";
import { cn } from "@/lib/utils";
import {
    Activity, ChevronRight, Cloud, HeartPulse, ShieldCheck,
    Stethoscope
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoginBackground } from "./_components/LoginBackground";
import { LOGIN_FEATURES } from "./_constants/login-features";

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.passwordType === "admin_created") {
      router.replace("/change-password");
      return;
    }

    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await login(phone, password);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(
        result.error || "Check-in failed. Please verify credentials.",
      );
      return;
    }

    if (result.needsPasswordChange) {
      router.push("/change-password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <div className="absolute top-6 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex flex-1 relative bg-background p-16 flex-col justify-between overflow-hidden border-r border-border/40 font-outfit">
        <LoginBackground />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/20">
                <HeartPulse className="h-7 w-7" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground tracking-tight leading-none block">
                  {APP_NAME}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mt-1 block">
                  Unified Hospital OS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>

          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground text-[11px] font-black tracking-widest uppercase">
                <Activity className="h-3 w-3" /> Live Clinical Operations
              </span>
              <h1 className="text-6xl font-black text-foreground leading-[1.05] tracking-tight text-balance">
                Hospital care. <br />
                <span className="text-primary italic">Simplified.</span>
              </h1>
            </div>

            <p className="text-muted-foreground text-xl leading-relaxed font-medium text-balance max-w-md">
              A unified workspace for clinical workflows, 
              hospital billing, and multi-department records.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-y-12 gap-x-12 mb-16">
            {LOGIN_FEATURES.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3 group">
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl bg-card flex items-center justify-center border border-border shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1",
                    item.color,
                  )}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-4 p-1.5 pr-6 rounded-2xl bg-card border border-border shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center text-background">
              <Cloud className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                Secure Infrastructure
              </span>
              <span className="text-xs font-bold text-foreground">
                End-to-End Verified
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">

        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] animate-fade-in relative z-10 px-4 sm:px-0">
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl mb-4">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black tracking-[0.2em] text-foreground uppercase">
              {APP_NAME}
            </h2>
          </div>

          <div className="space-y-3 mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight text-foreground">
              Command Center Access
            </h2>
            <p className="text-muted-foreground font-medium">
              Initialize your secure clinical session
            </p>
          </div>

          <Card className="border-border bg-card/80 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[2rem] overflow-hidden">
            <CardHeader className="pt-10 pb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/10 w-fit mx-auto lg:mx-0">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-black tracking-widest uppercase truncate">
                  Encrypted Clinical Access
                </span>
              </div>
            </CardHeader>

            <CardContent className="pb-12 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="phone"
                    className="text-[11px] font-black tracking-[0.15em] text-muted-foreground uppercase ml-1"
                  >
                    Staff Access Code
                  </Label>
                  <Input
                    id="phone"
                    className="h-14 rounded-2xl bg-muted/40 border-border focus:ring-primary/20 transition-all px-5 text-base font-medium placeholder:text-muted-foreground"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between ml-1">
                    <Label
                      htmlFor="password"
                      className="text-[11px] font-black tracking-[0.15em] text-muted-foreground uppercase"
                    >
                      Clinical Pass
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="h-14 rounded-2xl bg-muted/40 border-border focus:ring-primary/20 transition-all px-5 text-base font-medium placeholder:text-muted-foreground"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-base font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-[0.98] mt-2 group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-3 border-current border-t-transparent" />
                      Secure Entry...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Secure Entry{" "}
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-border">
              <div className="h-px w-full bg-current" />
              <Stethoscope className="h-5 w-5 shrink-0 text-border" />
              <div className="h-px w-full bg-current" />
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] text-balance px-4 leading-relaxed">
              Unified Medical Interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
