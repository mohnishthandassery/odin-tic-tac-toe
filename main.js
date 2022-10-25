const playerFactory = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    return board;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const setBoardItem = (index, value) => {
    board[index] = value;
  };

  const getBoardItem = (index) => {
    return board[index];
  };

  return {
    getBoard,
    resetBoard,
    setBoardItem,
    getBoardItem,
  };
})();

const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const messageElement = document.querySelector("#message");
  const resetElement = document.querySelector("#reset");
  const headingElement = document.querySelector("h2");

  const updateGameBoard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = GameBoard.getBoard()[i];
    }
  };

  const setMessage = (message) => {
    messageElement.textContent = message;
  };

  const setHeading = (message) => {
    headingElement.textContent = message;
  };

  fieldElements.forEach((field) => {
    field.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      gameController.playRound(index);
    });
  });

  resetElement.addEventListener("click", (e) => {
    GameBoard.resetBoard();
    gameController.resetRound();
    updateGameBoard();
    setMessage("");
  });

  return {
    updateGameBoard,
    setMessage,
    setHeading,
  };
})();

const gameController = (() => {
  const p1 = playerFactory("X");
  const p2 = playerFactory("O");
  let round = 0;
  let isOver = false;

  const setHeading = (message = `${getCurrentPlayer()}'s Turn`) => {
    displayController.setHeading(message);
  };

  const getCurrentPlayer = () =>
    round % 2 === 0 ? p1.getSign() : p2.getSign();

  const playRound = (index) => {
    if (GameBoard.getBoardItem(index) || isOver) return;
    GameBoard.setBoardItem(index, gameController.getCurrentPlayer());
    displayController.updateGameBoard();
    if (checkWinner(index)) {
      isOver = true;
      displayController.setMessage(`${getCurrentPlayer()} is the winner`);
      setHeading("Game Over");
    } else if (checkTie()) {
      isOver = true;
      displayController.setMessage(`It's a tie`);
      setHeading("Game Over");
    } else {
      round++;
      setHeading();
    }
  };

  const checkWinner = (index) => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];

    const hasWon = winCombos
      .filter((combo) => combo.includes(parseInt(index)))
      .some((el) =>
        el.every((ind) => {
          return GameBoard.getBoardItem(ind) === getCurrentPlayer();
        })
      );
    return hasWon;
  };

  const checkTie = () => {
    return !GameBoard.getBoard().filter((x) => x == "").length > 0;
  };

  const resetRound = () => {
    round = 0;
    isOver = false;
    setHeading();
  };

  setHeading();

  return { getCurrentPlayer, playRound, setHeading, resetRound };
})();
