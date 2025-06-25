"use client";
import React, { useRef, useEffect } from "react";
import { Menu, MenuHandle } from "@/components/Menu";
import parse from "html-react-parser";

declare global {
  interface Window {
    updateMenu: (newDesc: string) => void;
  }
}

export default function FourierSeries() {
  const menuRef = useRef<MenuHandle>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (iframeWindow) {
      iframeWindow.updateMenu = (newDesc: string) => {
        const newDescElement = parse(newDesc);
        menuRef.current?.changeDescription(newDescElement);
      };
    }

    return () => {
      delete (window as any).updateMenu;
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Menu
        ref={menuRef}
        links={[
          {
            name: "Source Code",
            href: "https://github.com/joey8angelo/portfolio/tree/main/public/legacy/fourier-series",
          },
        ]}
      />
      <iframe
        ref={iframeRef}
        src="legacy/fourier-series/index.html"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
