import RemovePositionModalContainer from "@containers/remove-position-modal-container/RemovePositionModalContainer";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export interface Props {
  positions: PoolPositionModel[];
  selectedIds: string[];
  isWrap: boolean;
}

export const useRemovePositionModal = ({
  positions,
  selectedIds,
  isWrap,
}: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const selectedPositions = useMemo(() => {
    return positions.filter(position => selectedIds.includes(position.id));
  }, [positions, selectedIds]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <RemovePositionModalContainer
        allPosition={positions}
        selectedPosition={selectedPositions}
        isWrap={isWrap}
      />,
    );
  }, [positions, selectedPositions, setModalContent, setOpenedModal, isWrap]);

  return {
    openModal,
  };
};
