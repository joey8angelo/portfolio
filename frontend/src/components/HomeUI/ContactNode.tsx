import GlitchText from "../GlitchText";

interface ContactNodeProps {
  id: string;
  label: string;
  value: string;
  href: string;
  className?: string;
  isExternal?: boolean;
}

export default function ContactNode({
  id,
  label,
  value,
  href,
  className = "",
  isExternal = false,
}: ContactNodeProps) {
  const target = isExternal ? "_blank" : undefined;
  const rel = isExternal ? "noopener noreferrer" : undefined;

  return (
    <div className={className}>
      <a
        href={href}
        target={target}
        rel={rel}
        className="block no-underline group h-full"
      >
        <div className="flex flex-col gap-1 p-3 border-l-2 border-[var(--color-accent)] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer h-full">
          <div className="flex justify-between items-center">
            <GlitchText
              text={id}
              className="text-[10px] text-[var(--color-text-muted)]"
            />
            <div className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full animate-pulse" />
          </div>
          <GlitchText
            text={label}
            className="text-xs uppercase text-[var(--color-success)]"
          />
          <GlitchText
            text={value}
            className="text-sm md:text-md text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors"
          />
        </div>
      </a>
    </div>
  );
}
