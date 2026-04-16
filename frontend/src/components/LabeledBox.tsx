export default function LabeledBox({
  label,
  children,
  className,
  pointerEvents = true,
}: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  pointerEvents?: boolean;
}) {
  return (
    <fieldset
      className={`${className} border-[1px] border-[var(--color-border)] ${pointerEvents ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* take a bite out of the border with the label */}
      {label && (
        <legend
          style={{
            padding: "0 8px",
            marginLeft: "8px",
          }}
        >
          {label}
        </legend>
      )}
      <div className="w-full h-full">{children}</div>
    </fieldset>
  );
}
