import React, { useRef, useEffect } from "react";
import { TextScramble, TextScrambleHandle } from "@/components/TextScramble";
import Image from "next/image";
import EmblaCarousel from "@/components/EmblaCarousel";

type ImageType = {
  src: string;
  alt: string;
  link?: string;
};

interface ProjectProps {
  className?: string;
  title: string;
  link?: string;
  description: React.ReactNode;
  images?: ImageType[];
  linkHint?: boolean;
  autoPlay?: boolean;
}

export default function Project({
  className = "",
  title,
  link = "#",
  description,
  images = [],
  linkHint = false,
  autoPlay = false,
}: ProjectProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<TextScrambleHandle>(null);
  const [showHint, setShowHint] = React.useState(linkHint);

  useEffect(() => {
    if (linkHint) {
      const localHint = localStorage.getItem("showHint");
      if (localHint && localHint === "false") {
        setShowHint(false);
      }
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          titleRef.current?.growAll();
        } else {
          titleRef.current?.shrinkAll();
        }
      },
      {
        root: null,
        threshold: 0.8,
      },
    );

    observer.observe(divRef.current as HTMLDivElement);
  }, []);

  return (
    <section className={`${className} flex flex-col lg:flex-row`} ref={divRef}>
      <div className="flex-none w-full lg:w-1/3 p-5 overflow-hidden">
        <a
          onClick={() => localStorage.setItem("showHint", "false")}
          href={link}
          className="w-fit cursor-pointer flex flex-row"
        >
          <TextScramble
            text={title}
            className="w-fit font-extrabold text-1xl md:text-3xl lg:text-5xl pl-2 pb-2
          border-l-2 border-(--primary) min-h-min"
            shrinkSpeed={10}
            shrinkOffset={5}
            growSpeed={5}
            growOffset={20}
            breakOnSpace={false}
            ref={titleRef}
          />
          {showHint && (
            <span className="text-xs md:text-sm lg:text-lg text-(--secondary) m-auto pl-2">
              (Click to view project)
            </span>
          )}
        </a>
        <div className="border-l-2 border-(--primary)">
          <div
            className="pl-2 blurs-light font-normal text-xs md:text-sm lg:text-lg border-2 border-l-0
          border-(--secondary)/30 rounded-r-lg"
          >
            {description}
          </div>
        </div>
      </div>
      {images.length >= 1 && (
        <div className="flex-1 w-full h-full lg:w-2/3 lg:pt-19 p-5 lg:pr-20 pb-20 flex flex-row lg:flex-col">
          <EmblaCarousel
            slides={images.map((image, index) => (
              <a
                href={image.link ? image.link : "#"}
                className={`${image.link ? "" : "cursor-default"} relative w-full h-full`}
              >
                <Image
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </a>
            ))}
            options={{ loop: true, autoPlay: autoPlay ? 500 : false }}
            classes={{
              main: "project-main blurs-light border-2 border-(--secondary)/30 rounded-lg",
              viewport: "project-viewport",
              container: "project-container",
              slide: "project-slide",
              slideNumber: "project-slide-number",
              controls: "project-controls",
              buttons: "project-buttons",
            }}
          />
        </div>
      )}
    </section>
  );
}
