import { Rnd } from "react-rnd";
import LabeledBox from "../LabeledBox";
import Label from "./Label";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { gsap } from "gsap";

interface LabelProps {
  title: string;
  imgSrc: string;
  imgAlt: string;
  width: number;
  height: number;
  x: number;
  y: number;
  delay?: number;
}

export default function ImgWindow({
  title,
  imgSrc,
  imgAlt,
  width,
  height,
  x,
  y,
  delay = 0,
}: LabelProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const isVideo = imgSrc.endsWith(".webm");
  useGSAP(() => {
    if (!windowRef.current) return;

    gsap.fromTo(
      windowRef.current,
      { x: -50, y: -50, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: delay,
        onStart: () => setShow(true),
      },
    );
  }, [x, y, width, height]);
  return (
    <Rnd
      default={{
        x: x,
        y: y,
        width: width,
        height: height,
      }}
      lockAspectRatio={true}
      className="pointer-events-auto z-100"
    >
      <div ref={windowRef} className="w-full h-full">
        {show && (
          <LabeledBox
            label={<Label text={title} />}
            className="w-full h-full pointer-events-auto"
          >
            {isVideo ? (
              <video
                src={imgSrc}
                className="pointer-events-none p-3 w-full h-full object-cover"
                autoPlay
                loop
              >
                {imgAlt}
              </video>
            ) : (
              <img
                src={imgSrc}
                alt={imgAlt}
                className="pointer-events-none p-3 w-full h-full object-cover"
              />
            )}
          </LabeledBox>
        )}
      </div>
    </Rnd>
  );
}
