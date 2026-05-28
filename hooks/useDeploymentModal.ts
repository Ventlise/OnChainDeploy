import { useState } from "react";
import type { DeployMode } from "@/services/fees";

export interface ModalState {
  isOpen: boolean;
  mode: DeployMode;
}

/**
 * useDeploymentModal — manages open/close + deploy mode for one contract card.
 * Each ContractCard gets its own instance of this hook.
 */
export function useDeploymentModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: "deploy",
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const openDeploy = () => setModal({ isOpen: true, mode: "deploy" });
  const openVerify = () => setModal({ isOpen: true, mode: "deploy-verify" });
  const close = () => {
    if (!isDeploying) setModal((m) => ({ ...m, isOpen: false }));
  };

  return {
    isOpen: modal.isOpen,
    mode: modal.mode,
    isDeploying,
    setIsDeploying,
    openDeploy,
    openVerify,
    close,
  };
}
