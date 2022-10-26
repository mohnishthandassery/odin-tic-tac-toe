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
  let isAIMatch = false;
  const comElement = document.querySelector("#com");
  const playerElement = document.querySelector("#player");
  const startScreenElement = document.querySelector("#start-screen");
  const gameScreenElement = document.querySelector("#game-screen");

  const human = p1.getSign();
  const AI = p2.getSign();

  let round = 0;
  let isOver = false;

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

  comElement.addEventListener("click", (e) => {
    setMatch(true);
  });
  playerElement.addEventListener("click", (e) => {
    setMatch(false);
  });

  const setMatch = (isAI) => {
    isAIMatch = isAI;
    startScreenElement.classList.add("hide");
    gameScreenElement.classList.remove("hide");
  };
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
      if (isAIMatch && getCurrentPlayer() === AI) {
        let bestMove = findBestMove(GameBoard.getBoard(), AI);
        playRound(bestMove);
      }
      setHeading();
    }
  };

  const checkWinner = (index) => {
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

  // Minimax Algorithm

  const evaluate = () => {
    let player = AI;
    let opponent = human;

    const hasPlayerWon = winCombos.some((el) =>
      el.every((ind) => {
        return GameBoard.getBoardItem(ind) === player;
      })
    );

    const hasOpponentWon = winCombos.some((el) =>
      el.every((ind) => {
        return GameBoard.getBoardItem(ind) === opponent;
      })
    );

    if (hasPlayerWon) return +10;
    else if (hasOpponentWon) return -10;

    return 0;
  };

  const minimax = (board, depth, isMax) => {
    let score = evaluate();

    if (score == 10 || score == -10) {
      return score;
    }
    if (checkTie()) return 0;

    const player = isMax ? AI : human;
    let best = isMax ? -1000 : 1000;
    let mmScore = 0;
    for (let i = 0; i < 9; i++) {
      if (board[i] == "") {
        board[i] = player;
        mmScore = minimax(board, depth + 1, !isMax, i);
        best = isMax ? Math.max(best, mmScore) : Math.min(best, mmScore);

        board[i] = "";
      }
    }
    return best;
  };

  findBestMove = (board, player) => {
    let bestVal = -1000;
    let bestMove = 0;
    for (let i = 0; i < 9; i++) {
      if (board[i] == "") {
        board[i] = player;

        let moveVal = minimax(board, 0, true);
        board[i] = "";
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }

    return bestMove;
  };

  setHeading();

  return { getCurrentPlayer, playRound, setHeading, resetRound };
})();
