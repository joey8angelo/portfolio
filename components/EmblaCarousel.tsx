import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "@/components/EmblaCarouselArrowButtons";
import {
  SelectedSnapDisplay,
  useSelectedSnapDisplay,
} from "./EmblaCarouselSelectedSnapDisplay";
import useEmblaCarousel from "embla-carousel-react";

type classesType = {
  main?: string;
  viewport?: string;
  container?: string;
  slide?: string;
  slideNumber?: string;
  controls?: string;
  buttons?: string;
};

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  classes?: classesType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  let { slides, options, classes } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  if (!classes) {
    classes = {};
  }

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi);

  return (
    <section className={`${classes.main ? classes.main : ""}`}>
      <div
        className={`${classes.viewport ? classes.viewport : ""}`}
        ref={emblaRef}
      >
        <div className={`${classes.container ? classes.container : ""}`}>
          {slides.map((slide, index) => (
            <div
              className={`${classes.slide ? classes.slide : ""}`}
              key={index}
            >
              <div
                className={`${classes.slideNumber ? classes.slideNumber : ""} relative`}
              >
                {slide}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className={`${classes.controls ? classes.controls : ""}`}>
          <div className={`${classes.buttons ? classes.buttons : ""}`}>
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>

          <SelectedSnapDisplay
            selectedSnap={selectedSnap}
            snapCount={snapCount}
          />
        </div>
      )}
    </section>
  );
};

export default EmblaCarousel;
