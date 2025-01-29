import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted dark:bg-muted/50">
      <div className="container py-6">
        <div className="contain-icons justify-center">
          DevSpace <Copyright size={18} /> 2025{" "}
          <span className="text-muted-foreground">
            Made by{" "}
            <a className="link" href="https://os-mhmd.vercel.app">
              Osama Mohammed
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
