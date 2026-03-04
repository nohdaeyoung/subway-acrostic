"use client";

import { useEffect } from "react";
import { getAdminSettings } from "@/lib/admin-settings";

export default function AdminScripts() {
  useEffect(() => {
    const settings = getAdminSettings();

    if (settings.googleVerification) {
      const meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = settings.googleVerification;
      document.head.appendChild(meta);
    }

    if (settings.naverVerification) {
      const meta = document.createElement("meta");
      meta.name = "naver-site-verification";
      meta.content = settings.naverVerification;
      document.head.appendChild(meta);
    }

    if (settings.googleAnalyticsId) {
      const gtagSrc = document.createElement("script");
      gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
      gtagSrc.async = true;
      document.head.appendChild(gtagSrc);

      const gtagInline = document.createElement("script");
      gtagInline.textContent = [
        "window.dataLayer = window.dataLayer || [];",
        "function gtag(){dataLayer.push(arguments);}",
        "gtag('js', new Date());",
        `gtag('config', '${settings.googleAnalyticsId}');`,
      ].join("\n");
      document.head.appendChild(gtagInline);
    }

    if (settings.customHead) {
      const doc = new DOMParser().parseFromString(settings.customHead, "text/html");
      doc.querySelectorAll("script").forEach((el) => el.remove());
      doc.querySelectorAll("*").forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
        });
      });
      Array.from(doc.head.childNodes).forEach((node) =>
        document.head.appendChild(node.cloneNode(true))
      );
    }

    if (settings.customBody) {
      const doc = new DOMParser().parseFromString(settings.customBody, "text/html");
      doc.querySelectorAll("script").forEach((el) => el.remove());
      doc.querySelectorAll("*").forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
        });
      });
      const frag = document.createDocumentFragment();
      Array.from(doc.body.childNodes).forEach((node) =>
        frag.appendChild(node.cloneNode(true))
      );
      document.body.insertBefore(frag, document.body.firstChild);
    }
  }, []);

  return null;
}
