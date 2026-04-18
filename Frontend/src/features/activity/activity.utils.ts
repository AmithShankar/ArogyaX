export const ACTION_STYLES = {
  create: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  update: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  view: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  login: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  logout: "bg-muted text-muted-foreground border-border",
} as const;

export type ActionType = keyof typeof ACTION_STYLES;

export function getActionColor(action: string) {
  return (
    ACTION_STYLES[action as ActionType] ??
    "bg-primary/10 text-primary border-primary/20"
  );
}
