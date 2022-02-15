const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

const DANCE_ANIMATION_DURATION = 500

//An infura ID, or custom ETH node is required for Ethereum
var provider = new WalletConnectProvider.default({
  infuraId: "2d05279d9bf8421cb463bd4530c01121",
  rpc: { 56: "https://bsc-dataseed.binance.org/" },
});
//to set it to BSC, uncomment the following line
//provider.chainId = 56;
//present the Wallet Connect QR code
provider.enable().then( async res => {
  console.log(res)
  //get wallet addrs and then wrap this into the Web3 JS
  let web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  console.log('accounts:', accounts)
  //now do all the web3 stuff you want...
  //awesome web3 application goes here

  let wordle;
  let lastPlayed;

  const getWordle = () => {
    fetch("http://localhost:8000/json_placeholder/word")
      .then((response) => response.json())
      .then((json) => {
        wordle = json.toUpperCase();
        console.log("wordle", wordle);
      })
      .catch((err) => console.log(err));
  };
  getWordle();

  const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "«",
  ];

  let currentRow = 0;
  let currentTile = 0;
  let isGameOver = false;

  const guessRows = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];

  guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.setAttribute("id", "guessRow-" + guessRowIndex);

    guessRow.forEach((guess, guessIndex) => {
      const tileElement = document.createElement("div");
      tileElement.setAttribute(
        "id",
        "guessRow-" + guessRowIndex + "-tile-" + guessIndex
      );
      tileElement.classList.add("tile");
      rowElement.append(tileElement);
    });

    tileDisplay.append(rowElement);
  });

  keys.forEach((key) => {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () => handleClick(key));
    keyboard.append(buttonElement);
  });

  const handleClick = (letter) => {
    if (!isGameOver) {
      console.log("clicked", letter);
      if (letter === "«") {
        deleteLetter();
        console.log("guessRows", guessRows);
        return;
      }
      if (letter === "ENTER") {
        checkRow();
        console.log("guessRows", guessRows);
        return;
      }
      addLetter(letter);
    }
  };

  const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
      const tile = document.getElementById(
        "guessRow-" + currentRow + "-tile-" + currentTile
      );
      tile.textContent = letter;

      guessRows[currentRow][currentTile] = letter;
      tile.setAttribute("data", letter);
      currentTile++;
    }
  };

  const deleteLetter = () => {
    if (currentTile > 0) {
      currentTile--;
      const tile = document.getElementById(
        "guessRow-" + currentRow + "-tile-" + currentTile
      );
      tile.textContent = "";
      guessRows[currentRow][currentTile] = "";
      tile.setAttribute("data", "");
    }
  };

  const checkRow = () => {
    const guess = guessRows[currentRow].join("");
    const rowTiles = document.querySelector(
      "#guessRow-" + currentRow
    ).childNodes;
    console.log('current row', guessRows[currentRow])
    if (currentTile > 4) {
      fetch(`http://localhost:8000/json_placeholder/check/?word=${guess}`)
        .then((response) => response.json())
        .then((json) => {
          if (json == "Entry word not found") {
            showMessage("word not in list");
            return;
          } else {
            flipTile();
            if (wordle == guess) {
              showMessage("Magnificent!");
              danceTiles(rowTiles)
              lastPlayed = new Date()
              console.log(lastPlayed.getHours())
              isGameOver = true;
              return;
            } else {
              if (currentRow >= 5) {
                isGameOver = true;
                showMessage(`Game Over! ${wordle}`);
                return;
              }
              if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
              }
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const showMessage = (message) => {
    console.log("message:", message);
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
  };

  const addColorTokey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter);
    key.classList.add(color);
  };

  const flipTile = () => {
    const rowTiles = document.querySelector(
      "#guessRow-" + currentRow
    ).childNodes;
    console.log('rowTiles', rowTiles)
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach((tile) => {
      guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
    });

    guess.forEach((guess, index) => {
      if (guess.letter == wordle[index]) {
        guess.color = "green-overlay";
        checkWordle = checkWordle.replace(guess.letter, "");
      }
    });

    guess.forEach((guess) => {
      if (checkWordle.includes(guess.letter)) {
        guess.color = "yellow-overlay";
        checkWordle = checkWordle.replace(guess.letter, "");
      }
    });

    rowTiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("flip");
        tile.classList.add(guess[index].color);
        addColorTokey(guess[index].letter, guess[index].color);
      }, 500 * index);
    });
  };

  function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("dance")
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("dance")
          },
          { once: true }
        )
      }, (index * DANCE_ANIMATION_DURATION) / 5)
    })
  }
});


