import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react"
import { siteConfig } from "@/lib/site"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background" id="contact">
      <div className="container mx-auto px-4 py-10">
        {/* Grid Layout */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{siteConfig.name}</h3>
            <Image
              src="/images/logo.png"
              alt="ParkMaster"
              width={276}
              height={276}
              className="h-10 w-10"
            />
            <p className="text-sm text-muted-foreground">
              Find and list parking spots easily and securely.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Connect
            </h4>
            <div className="flex gap-4 text-muted-foreground">
              <Link href={siteConfig.links.twitter} target="_blank">
                <Twitter className="h-5 w-5 hover:text-foreground transition-colors" />
              </Link>
              <Link href={siteConfig.links.github} target="_blank">
                <Github className="h-5 w-5 hover:text-foreground transition-colors" />
              </Link>
              <Link href={siteConfig.links.linkedin} target="_blank">
                <Linkedin className="h-5 w-5 hover:text-foreground transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
