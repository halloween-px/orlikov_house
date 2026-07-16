import Image from "next/image";
import { siteConfig } from "@/config";

export default function SvgLogo() {
  return (
    <Image
      src={siteConfig.assets.slogan}
      alt={siteConfig.brand.name}
      width={691}
      height={385}
      className="h-auto w-full"
      priority
    />
  );
}
