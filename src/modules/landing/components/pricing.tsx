import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

// Giá/tính năng dưới đây là placeholder minh hoạ, chưa phải gói cước chính thức.
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/tháng",
    description: "Phù hợp cá nhân hoặc team nhỏ mới bắt đầu.",
    features: ["1 Workspace", "Tối đa 5 thành viên", "Kanban Board", "Basic Notification"],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "/người/tháng",
    description: "Cho team đang phát triển, cần Scrum và báo cáo nâng cao.",
    features: [
      "Workspace không giới hạn",
      "Thành viên không giới hạn",
      "Kanban & Scrum Board",
      "Sprint Report (Burndown/Velocity)",
      "Activity Log đầy đủ",
    ],
    cta: "Start Free Trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Liên hệ",
    period: "",
    description: "Cho tổ chức cần bảo mật, phân quyền và hỗ trợ chuyên sâu.",
    features: ["Mọi tính năng của Pro", "SSO & phân quyền nâng cao", "SLA hỗ trợ riêng", "Onboarding riêng"],
    cta: "Contact Sales",
    href: "mailto:sales@ndt-task.local",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-widest text-blue-500">PRICING</p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Bắt đầu miễn phí, nâng cấp khi team của bạn phát triển.
        </p>
        <Badge variant="outline" className="mt-4">
          Giá minh hoạ — sẽ cập nhật khi có gói cước chính thức
        </Badge>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative border-border/60",
              plan.highlighted && "border-blue-500/50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/50",
            )}
          >
            {plan.highlighted ? (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white">
                Popular
              </Badge>
            ) : null}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-heading text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                render={<Link href={plan.href} />}
                className={cn(
                  "w-full",
                  plan.highlighted && "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90",
                )}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
