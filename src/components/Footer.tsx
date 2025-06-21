import { useState } from "react";
import Control from "./Control";
import { useModeSelection } from "@/web3/modeSelection";

const Footer: React.FC = () => {
  const [showModeSelection, setShowModeSelection] = useState(false);
  const { currentMode, selectMode, isApproved } = useModeSelection();

  const handleModeSelect = async (selectedMode: "onchain" | "offchain") => {
    try {
      await selectMode(selectedMode);
      setShowModeSelection(false);
    } catch (error) {
      console.error("Mode selection failed:", error);
    }
  };

  return (
    <div className="leading-lg flex flex-col gap-y-8 text-center font-medium text-[#adadad]">
      <div className="mt-2 w-full">
        <Control />
        <div className="relative">
          <button
            onClick={() => setShowModeSelection(!showModeSelection)}
            className="font-menlo mt-2 w-full text-[#f54b59] bg-[#082b2bfd] px-16 py-4"
            disabled={!isApproved}
          >
            {currentMode ? `Mode: ${currentMode}` : "Select Mode"}
          </button>
          
          {showModeSelection && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-md p-2 z-10">
              <button
                onClick={() => handleModeSelect("onchain")}
                className="block w-full p-2 hover:bg-gray-700"
              >
                Onchain Mode
              </button>
              <button
                onClick={() => handleModeSelect("offchain")}
                className="block w-full p-2 hover:bg-gray-700"
              >
                Offchain Mode
              </button>
            </div>
          )}
        </div>
      </div>
      <p>
        Onchain 2048{" "}
        <a
          href="https://cuannode.greyscope.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          © 2025 Greyscope&Co. by;0xgr3y
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;