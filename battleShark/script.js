var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		var hit = document.getElementById(location);
		hit.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		var miss = document.getElementById(location);
		miss.setAttribute("class", "miss");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
	{ locations: [0, 0, 0], hits: ["", "", ""] },
	{ locations: [0, 0, 0], hits: ["", "", ""] }],
	fire: function (guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit") {
				view.displayMessage("Снова в то же место!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Ауч! Попал!");
				if (this.isSunk(ship)) {
					view.displayMessage("Ты убил мою акулу(((");
					this.shipsSunk++;
				} return true;
			}
		} view.displayMiss(guess);
		view.displayMessage("Хах, не попал!)");
		return false;
	},
	isSunk: function (ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		} return true;
	},
	generateShipLocations: function () {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateNewShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateNewShip: function () {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			col = Math.floor(Math.random() * this.boardSize);
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		} return newShipLocations;
	},
	collision: function (locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		} return false;
	}
};

var controller = {
	guesses: 0,
	processGuess: function (guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Все мои акулы мертвы.. убийца! Тебе понадобилось: " + this.guesses + " попыток");
				var end = document.getElementById("form");
				end.remove();
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Введите корректное значение: (буква)(цифра)");
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column)) {
			alert("Здесь таких координат нет)");
		} else if (row < 0 || row >= model.boardSize
			|| column < 0 || column >= model.boardSize) {
			alert("Координаты не в области поля")
		} else {
			return row + column;
		}
	} return null;
};

function init() {
	view.displayMessage("Привет, попробуй загарпунить моих акул, они плавают стаями по 3 в ряд, координаты должны быть на Английском и с большой буквы!");
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handlerClick;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
};

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
};

function handlerClick() {
	var userInput = document.getElementById("guessInput");
	var guess = userInput.value;
	controller.processGuess(guess);
	userInput.value = "";
};

window.onload = init;

