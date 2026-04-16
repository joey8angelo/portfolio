export default function LabeledBox({
  label,
  children,
  className,
}: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      className={className}
      style={{
        border: "1px solid #878787",
      }}
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
      <div className="mt-[-8px] w-full h-full">{children}</div>
    </fieldset>
  );
}
