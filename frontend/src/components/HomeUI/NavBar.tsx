import R3FIcon from "../R3FIcon/R3FIcon";
import PulsarIcon from "../R3FIcon/PulsarIcon";
import WireframeSphereIcon from "../R3FIcon/WireframeSphereIcon";
import GuyIcon from "../R3FIcon/GuyIcon";
import useNavigationStore from "../../store/useNavigationStore";

export default function NavBar() {
  const activeTab = useNavigationStore((state) => state.activeTab);
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);

  const buttonClassName = `background-none color-none border-none p-0 cursor-pointer outline-none font-mono text-lg uppercase flex items-center justify-center w-full h-full`;

  const duration = 300;

  return (
    <header className="w-full h-[100px]">
      <nav className="h-full">
        <ul className="flex flex-row gap-2 text-white min-w-0 h-full">
          <li className="flex-grow min-w-0 h-full">
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
          <li className="flex-grow min-w-0 h-full">
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
          <li className="flex-grow min-w-0 h-full">
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
