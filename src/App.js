import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Home from "./components/Home";
import EmptyBoard from './components/EmptyBoard';
import boardsSlice from "./redux/boardsSlice";
import AccessCode from './access-code/AccessCode';

export default function App() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);

  if (!activeBoard && boards.length > 0)
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));

  const handleAccessGranted = () => {
    setIsAccessGranted(true);
  };

  const handleLogout = () => {
    setIsAccessGranted(false);
  };

  return (
    <div className="overflow-hidden overflow-x-scroll">
      {isAccessGranted ? (
        <>
          {boards.length > 0 ? (
            <>
              <Header
                setIsBoardModalOpen={setIsBoardModalOpen}
                isBoardModalOpen={isBoardModalOpen}
                onLogout={handleLogout} // Pass handleLogout to Header
              />
              <Home
                setIsBoardModalOpen={setIsBoardModalOpen}
                isBoardModalOpen={isBoardModalOpen}
              />
            </>
          ) : (
            <EmptyBoard type='add' />
          )}
        </>
      ) : (
        <AccessCode onAccessGranted={handleAccessGranted} />
      )}
    </div>
  );
}
