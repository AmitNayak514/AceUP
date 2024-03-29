"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  FileQuestionIcon,
  TrendingUp,
  NewspaperIcon,
  BookOpen,
  Users2,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });
const routes = [
  {
    label: "Personalized Test",
    icon: FileQuestionIcon,
    desc: "Take adaptive tests tailored to your learning pace and needs.",
    color: "text-violet-500",
    bgColor: "text-violet-500/10",
    href: "/personalized-test",
  },
  {
    label: "Performance Insights",
    icon: NewspaperIcon,
    desc: "Get detailed insights into your test performance and areas for improvement.",
    color: "text-orange-700",
    bgColor: "text-orange-700/10",
    href: "/performance-insights",
  },
  {
    label: "Progress Tracking",
    icon: TrendingUp,
    desc: "Track your progress over time and set goals for improvement.",
    color: "text-green-700",
    bgColor: "text-green-700/10",
    href: "/progress-tracking",
  },
  {
    label: "Study Materials",
    icon: BookOpen,
    desc: "Access a library of study materials and resources to enhance your learning.",
    color: "text-blue-700",
    bgColor: "text-blue-700/10",
    href: "/study-materials",
  },
  {
    label: "Community Forums",
    icon: Users2,
    desc: "Engage with peers and experts in community forums for collaborative learning.",
    color: "text-indigo-700",
    bgColor: "text-indigo-700/10",
    href: "/community-forums",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            Questify
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full cursor-pointer justify-start font-medium hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn("h-5 w-6 mr-3 text-white", route.color)}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
