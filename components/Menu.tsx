"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface MenuHandle {
  changeDescription: (newDesc: React.ReactNode) => void;
  menuOpen: () => void;
  menuClose: () => void;
}

interface MenuProps {
  links?: {
    name: string;
    href: string;
  }[];
  description?: React.ReactNode;
  lightBlur?: boolean;
}

export const Menu = forwardRef<MenuHandle, MenuProps>(
  ({ links = [], description, lightBlur = false }, ref) => {
    const backdropRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const openButtonRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLBodyElement>(null);
    const [desc, setDesc] = useState<React.ReactNode>(description);

    useEffect(() => {
      bodyRef.current = document.querySelector("body");
    }, [desc]);

    const allLinks = [
      { name: "Home", href: "/" },
      { name: "GitHub", href: "https://github.com/joey8angelo" },
      { name: "Email", href: "mailto: joey8angelo@gmail.com" },
    ];
    allLinks.push(...links);

    function changeDescription(newDesc: React.ReactNode) {
      setDesc(newDesc);
    }

    function menuOpen() {
      backdropRef.current?.classList.remove("hidden");
      openButtonRef.current?.classList.add("hidden");
      bodyRef.current?.classList.add("overflow-hidden");
      void backdropRef.current?.offsetWidth;
      if (lightBlur) {
        backdropRef.current?.classList.add("blurs-light");
      } else {
        backdropRef.current?.classList.add("blurs-strong");
      }
      menuRef.current?.classList.remove("translate-x-full");
    }
    function menuClose() {
      if (lightBlur) {
        backdropRef.current?.classList.remove("blurs-light");
      } else {
        backdropRef.current?.classList.remove("blurs-strong");
      }
      openButtonRef.current?.classList.remove("hidden");
      bodyRef.current?.classList.remove("overflow-hidden");
      menuRef.current?.classList.add("translate-x-full");
      setTimeout(() => {
        backdropRef.current?.classList.add("hidden");
      }, 500);
    }

    useImperativeHandle(ref, () => ({
      changeDescription,
      menuOpen,
      menuClose,
    }));

    return (
      <>
        <div
          ref={openButtonRef}
          className="fixed top-2 lg:top-5 right-6 cursor-pointer"
          onClick={menuOpen}
        >
          <svg
            width="55"
            height="35"
            viewBox="5 5 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 8H2V10H22V8ZM5 14H2V16H22V14Z" fill="#fff"></path>
          </svg>
        </div>
        <div
          ref={backdropRef}
          className="z-100 w-screen h-screen fixed top-0 left-0 
        will-change-[backdrop-filter] transform-gpu transition-[backdrop-filter]
        duration-500 hidden"
          onClick={menuClose}
        ></div>
        <div
          ref={menuRef}
          className="z-101 w-screen lg:w-1/2 h-screen fixed top-0 right-0 bg-black/90
        transform-gpu transition-transform duration-500 translate-x-full 
        lg:border-l-2 lg:border-(--secondary)/30"
        >
          <svg
            onClick={menuClose}
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="50"
            viewBox="0 0 25 25"
            className="fixed top-4 right-6 cursor-pointer"
          >
            <path
              fill="white"
              d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
            />
          </svg>
          <nav className="">
            <ul className="lg:text-5xl text-4xl font-[400] pt-10 pr-10 pl-5">
              {allLinks.map((link, index) => (
                <li key={index} className="mb-3 lg:mb-8">
                  <a className="bold no-underline" href={link.href}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {desc && (
            <div className="fixed bottom-0 w-full p-10">
              <div className="text-xs lg:text-lg border-t-1 border-(--secondary) text-center pt-5">
                {desc}
              </div>
            </div>
          )}
        </div>
      </>
    );
  },
);
