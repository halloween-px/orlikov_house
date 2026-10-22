"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { METRIKA_COUNTER_ID, siteGoals } from "@/config/metrika";
import { hitMetrika, reachGoal, rememberAttribution } from "@/lib/metrika";

function isMessengerHost(hostname: string) {
  const host = hostname.replace(/^www\./, "");
  return (
    host === "t.me" ||
    host === "telegram.me" ||
    host === "wa.me" ||
    host === "api.whatsapp.com" ||
    host === "max.ru" ||
    host.endsWith(".max.ru")
  );
}

export default function YandexMetrika() {
  const pathname = usePathname();
  const skipHit = useRef(true);
  const isPrivate =
    !METRIKA_COUNTER_ID ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api");

  useEffect(() => {
    if (isPrivate) return;
    rememberAttribution();
    if (skipHit.current) {
      skipHit.current = false;
      return;
    }
    hitMetrika(window.location.href);
  }, [pathname, isPrivate]);

  useEffect(() => {
    if (isPrivate) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      if (href.startsWith("tel:")) {
        reachGoal(siteGoals.phoneClick);
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (isMessengerHost(url.hostname)) {
        reachGoal(siteGoals.messengerClick);
        return;
      }

      if (url.pathname.toLowerCase().endsWith(".pdf")) {
        reachGoal(siteGoals.catalogDownload);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [isPrivate]);

  if (isPrivate) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${METRIKA_COUNTER_ID}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
