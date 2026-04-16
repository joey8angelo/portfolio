import LabeledBox from "../LabeledBox";
import Label from "./Label";

export default function AboutContent() {
  return (
    <LabeledBox
      label={<Label text="About Me" />}
      className="flex-1 overflow-y-scroll"
    ></LabeledBox>
  );
}
