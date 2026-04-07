import R3FIcon from "./R3FIcon";
import PulsarIcon from "./Header/PulsarIcon";
import WireframeSphereIcon from "./Header/WireframeSphereIcon";
import GuyIcon from "./Header/GuyIcon";
import { useNavigationStore } from "../store";

export default function Header() {
  // const { activeTab, setActiveTab } = useActiveTabStore();
  // const { selection, deselect } = useSceneSelectionStore();

  // const { setTextPathState } = useTextPathStore();

  const { activeTab, setActiveTab } = useNavigationStore();

  const buttonClassName = `background-none color-none border-none p-0 cursor-pointer outline-none font-mono text-lg uppercase flex items-center justify-center w-full h-full`;

  const duration = 300;

  return (
    <header className="absolute bottom-4 left-20 z-10 pointer-events-auto w-[200px] h-[50px]">
      <nav>
        <ul className="flex flex-row gap-2 text-white min-w-0">
          <li className="flex-grow h-[50px] min-w-0">
            <button
              className={`${buttonClassName} min-w-0`}
              onClick={() => setActiveTab("home")}
            >
              <R3FIcon>
                <PulsarIcon
                  selected={activeTab === "home"}
                  duration={duration}
                />
              </R3FIcon>
            </button>
          </li>
          <li className="flex-grow h-[50px] min-w-0">
            <button
              className={`${buttonClassName} min-w-0`}
              onClick={() => setActiveTab("sky")}
            >
              <R3FIcon>
                <WireframeSphereIcon
                  selected={activeTab === "sky"}
                  duration={duration}
                />
              </R3FIcon>
            </button>
          </li>
          <li className="flex-grow h-[50px] min-w-0">
            <button
              className={`${buttonClassName} min-w-0`}
              onClick={() => setActiveTab("about")}
            >
              <R3FIcon>
                <GuyIcon selected={activeTab === "about"} duration={duration} />
              </R3FIcon>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
//
