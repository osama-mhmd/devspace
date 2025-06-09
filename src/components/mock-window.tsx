import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function MockWindow({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl transform rotate-3"></div>
      <Card className="relative bg-gradient-to-br from-background to-muted/30 border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-primary/20 rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-4/5"></div>
            <div className="h-3 bg-muted rounded w-3/5"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
