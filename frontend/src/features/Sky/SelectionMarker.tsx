import * as THREE from "three";
import { useRef, useEffect, forwardRef } from "react";
import { Html } from "@react-three/drei/web/Html";
import { gsap } from "gsap";
import steppedEase from "../../lib/steppedEase";

const steps = 4;
const duration = 1.5;

interface SelectionMarkerProps {
  visible: boolean;
  position?: THREE.Vector3;
}

const SelectionMarker = forwardRef<THREE.Group, SelectionMarkerProps>(
  ({ visible, position }, ref) => {
    const tlR = useRef<SVGPathElement>(null);
    const brR = useRef<SVGPathElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
      if (!visible) {
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
        return;
      }

      const timeoutId = setTimeout(() => {
        if (!tlR.current || !brR.current) return;

        tlRef.current = gsap.timeline({
          repeat: -1,
          repeatDelay: 2,
        });
        tlRef.current
          .to(tlR.current, {
            x: 2,
            y: 2,
            stroke: "#FFFFFF",
            duration: duration,
            ease: steppedEase("power4.out", steps),
          })
          .to(
            brR.current,
            {
              x: -2,
              y: -2,
              stroke: "#FFFFFF",
              duration: duration,
              ease: steppedEase("power4.out", steps),
            },
            0,
          );

        tlRef.current
          .to(tlR.current, {
            x: 0,
            y: 0,
            stroke: "#878787",
            duration: duration,
            ease: steppedEase("power2.in", steps),
          })
          .to(
            brR.current,
            {
              x: 0,
              y: 0,
              stroke: "#878787",
              duration: duration,
              ease: steppedEase("power2.in", steps),
            },
            "<",
          );
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
      };
    }, [visible]);

    return (
      <group position={position} ref={ref}>
        {visible && (
          <Html center zIndexRange={[200, 0]}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                shapeRendering: "geometricPrecision",
                willChange: "transform",
              }}
            >
              <path
                ref={tlR}
                d="M4 10V4H10"
                stroke="#878787"
                strokeWidth="1"
                strokeLinecap="square"
              />

              <path
                ref={brR}
                d="M14 20H20V14"
                stroke="#878787"
                strokeWidth="1"
                strokeLinecap="square"
              />
            </svg>
          </Html>
        )}
      </group>
    );
  },
);

export default SelectionMarker;
