"use client";

import { CardTitle } from "@/components/ui/card";
import { COLORS } from "@/data/styleData";
import { cn } from "@/lib/utils";
import { BarChart3, Info, LineChart as LineChartIcon, LucideIcon, PieChart as PieChartIcon, TrendingUp, Users } from "lucide-react";
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis,
    YAxis
} from "recharts";

import {
    AdminChartsProps
} from "@/types";

function ChartPlaceholder({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) {
  return (
    <div className="flex h-[250px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-secondary/5 px-6 text-center animate-in fade-in zoom-in-95 duration-1000">
      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-background/50 text-primary shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="mt-5 text-sm font-bold tracking-tight text-foreground/90">{title}</h4>
      <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function AdminCharts({
  initialMonthlyVisits,
  initialRevenueData,
  initialDiagnosisData,
  initialPatientFrequency,
}: AdminChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className={cn("premium-glass animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 p-6")}>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg">Monthly Throughput</CardTitle>
            <p className="text-xs text-muted-foreground">Patient visit density over time</p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          {initialMonthlyVisits.length === 0 ? (
            <ChartPlaceholder
              icon={BarChart3}
              title="No visit data yet"
              description="Monthly throughput will manifest here once the first patient visits are recorded."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialMonthlyVisits}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border/50"
                />
                <XAxis 
                  dataKey="month" 
                  className="text-[10px] font-medium text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  className="text-[10px] font-medium text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border) / 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Bar
                  dataKey="visits"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className={cn("premium-glass animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 p-6")}>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg text-glow-primary">Revenue Pulse</CardTitle>
            <p className="text-xs text-muted-foreground">Financial health and growth trend</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          {initialRevenueData.length === 0 ? (
            <ChartPlaceholder
              icon={LineChartIcon}
              title="Revenue trend inactive"
              description="Financial metrics will populate as patient invoices are processed through the system."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={initialRevenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border/50"
                />
                <XAxis 
                  dataKey="month" 
                  className="text-[10px] font-medium text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  className="text-[10px] font-medium text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border) / 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  formatter={(v: number) => `₹${v.toLocaleString()}`} 
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className={cn("premium-glass animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 p-6")}>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg">Specialty Mix</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution of clinical cases</p>
          </div>
          <div className="rounded-2xl bg-sky-500/10 p-2.5 text-sky-600">
            <PieChartIcon className="h-5 w-5" />
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          {initialDiagnosisData.length === 0 ? (
            <ChartPlaceholder
              icon={PieChartIcon}
              title="Diagnosis data missing"
              description="Common health patterns will surface once medical charting begins for your patients."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={initialDiagnosisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {initialDiagnosisData.map((_, i) => (
                    <Cell 
                      key={i} 
                      fill={COLORS[i % COLORS.length]} 
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border) / 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className={cn("premium-glass animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 p-6")}>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg">User Engagement</CardTitle>
            <p className="text-xs text-muted-foreground">Active platform participants</p>
          </div>
          <div className="rounded-2xl bg-violet-500/10 p-2.5 text-violet-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          {initialPatientFrequency.length === 0 ? (
            <ChartPlaceholder
              icon={Info}
              title="Visit frequency empty"
              description="Insights into patient return rates will automatically generate from repeat visit entries."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialPatientFrequency}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border/50"
                />
                <XAxis 
                  dataKey="visits" 
                  className="text-[10px] font-medium text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  className="text-[10px] font-medium text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border) / 0.5)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--warning))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
