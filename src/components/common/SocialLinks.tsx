import BlueSkyIcon from "@/components/icons/BlueskyIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { XTwitterIcon } from "@/components/icons/XTwitterIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import type { QuerySocialLink, SocialMediaPlatforms } from "@/lib/sanity-derived-types";
import { resolveSafeHref } from "@/lib/utils/link-utils";
import { cn } from "@/lib/utils/ui-utils";

const socialIconMap: Partial<Record<SocialMediaPlatforms, React.ComponentType<{ className?: string }>>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  twitter: XTwitterIcon,
  bluesky: BlueSkyIcon,
};

function getSocialIcon(platform: SocialMediaPlatforms | null) {
  if (!platform) return null;
  return socialIconMap[platform] ?? null;
}

interface SocialLinksProps {
  socialLinks?: QuerySocialLink[] | null;
  className?: string;
  iconClassName?: string;
  linkClassName?: string;
}

export default function SocialLinks({
  socialLinks = [],
  className,
  iconClassName,
  linkClassName,
}: Readonly<SocialLinksProps>) {
  const items = (socialLinks ?? [])
    .map((social) => {
      const platform = social.platform;
      if (!platform) return null;

      const Icon = getSocialIcon(platform);
      if (!Icon) return null;

      const href = resolveSafeHref(social.url ?? "");
      if (!href) return null;

      return {
        key: `${platform}-${href}`,
        href,
        label: social.label?.trim() || platform,
        Icon,
      };
    })
    .filter(
      (item): item is { key: string; href: string; label: string; Icon: React.ComponentType<{ className?: string }> } =>
        Boolean(item),
    );

  if (!items.length) return null;

  return (
    <div className={cn("flex gap-3", className)}>
      {items.map((social) => {
        return (
          <a
            key={social.key}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={cn(
              "w-8 h-8 rounded-full bg-primary hover:bg-accent flex items-center justify-center transition-colors",
              linkClassName,
            )}
          >
            <social.Icon className={cn("w-4 h-4 text-white", iconClassName)} />
          </a>
        );
      })}
    </div>
  );
}
