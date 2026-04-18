export const COLORS = [
  "hsl(197, 78%, 37%)", // primary (cyan-blue)
  "hsl(160, 62%, 37%)", // success (green)
  "hsl(200, 76%, 46%)", // info (blue)
  "hsl(35, 84%, 52%)",  // warning (amber)
  "hsl(0, 69%, 50%)",   // destructive (red)
  "hsl(270, 50%, 55%)", // purple (distinct 6th)
];

export const actionColors: Record<string, string> = {
  login: "bg-[hsl(var(--success)/0.14)] text-[hsl(var(--success))]",
  logout: "bg-muted text-muted-foreground",
  create: "bg-primary/12 text-primary",
  update: "bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning-foreground))]",
  delete: "bg-destructive/12 text-destructive",
  view: "bg-[hsl(var(--info)/0.14)] text-[hsl(var(--info))]",
  generate: "bg-primary/12 text-primary",
};
