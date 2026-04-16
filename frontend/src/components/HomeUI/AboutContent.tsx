import LabeledBox from "../LabeledBox";
import Label from "./Label";
import GlitchText from "../GlitchText";
import GlitchTextAnimationWrapper from "../GlitchTextAnimationWrapper";

export default function AboutContent() {
  return (
    <LabeledBox
      label={<Label text="About Me" />}
      className="flex-1 overflow-y-scroll"
    >
      <div className="w-full h-full px-4 py-4">
        <GlitchTextAnimationWrapper
          name="AboutMe"
          className="w-full h-full flex flex-col flex-1"
        >
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <GlitchText text="Hi, my name is Joseph D'Angelo, but I go by joey." />

              <span>
                <GlitchText text="I have experience in " delay={500} />
                <GlitchText
                  text="C/C++, Python, and JavaScript/TypeScript"
                  className="text-[var(--color-accent)] text-glow-xl"
                />
                <GlitchText text="." />
              </span>

              <GlitchText text="I have a passion for building performant and fun applications, and I am always looking for new challenges to tackle. Including programming, my other interests include: " />
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <GlitchText
                  delay={500}
                  text="Science Fiction"
                  className="text-[var(--color-accent)] text-glow-xl"
                />
                <GlitchText
                  text="The stories we read today become the world we live in tomorrow. I am deeply interested in the frontier of technology, and driven by the social challenge of bridging the gap between dreaming these futures and engineering them safely for everyone."
                  className="text-[var(--color-text-muted)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <GlitchText
                  delay={500}
                  text="Space, and Our Place in It"
                  className="text-[var(--color-accent)] text-glow-xl"
                />
                <div className="border-l border-solid border-indigo-600 pl-3 shadow-[inset_10px_0_10px_-5px_rgba(168,85,247,0.4)]">
                  <GlitchText
                    text='"In all of this emptiness, this is a whole bunch of nothing, this thing we call the universe - you have this oasis, this beautiful place that we get to exist together." - Victor Glover'
                    className="text-[var(--color-text-muted)] italic"
                  />
                </div>
                <GlitchText
                  text="To me, space exploration is not about leaving Earth behind; it's about gaining the perspective to truly appreciate it. As we reach further into the stars, I believe we must remain grounded in the fact that we are one people, building a collective future."
                  className="text-[var(--color-text-muted)]"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span>
                <GlitchText
                  text="EMAIL: "
                  className="text-[var(--color-text-muted)]"
                />
                <a href="mailto:joey4angelo@gmail.com">
                  <GlitchText text="joey4angelo@gmail.com" />
                </a>
              </span>
              <span>
                <GlitchText
                  text="GITHUB: "
                  className="text-[var(--color-text-muted)]"
                />
                <a
                  href="https://github.com/joey8angelo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GlitchText text="github.com/joey4angelo" />
                </a>
              </span>
              <span>
                <GlitchText
                  text="LINKEDIN: "
                  className="text-[var(--color-text-muted)]"
                />
                <a
                  href="https://www.linkedin.com/in/joseph-dangelo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GlitchText text="linkedin.com/in/joseph-dangelo" />
                </a>
              </span>
            </div>
          </div>
        </GlitchTextAnimationWrapper>
      </div>
    </LabeledBox>
  );
}
