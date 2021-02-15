const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = [];
CHECKPOINTS = [];
PERSONS = [];

// СДЕЛАТЬ АНИМАЦИЮ ИСЧЕЗНОВЕНИЯ ЭЛЕМЕНТА ПОСЛЕ ПРИХОДА В КОНЕЧНУЮ ТОЧКУ И ПЕРЕД АТТАЧЕМ


class Person {
    constructor(personID, personFullName, currentLocation) {
        this.ID = personID;
        this.fullName = personFullName;
        this.location = currentLocation;
    }
}

function isPersonIn(personID) {
    PERSONS.forEach(element => {
        if (element.ID == personID) {
            // если человек уже существует, то true
            return element;
        }
    });
    return false;
}

function initPersons() {
    fetch("http://127.0.0.1:8080/location.json", { mode: 'same-origin' })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response  
                response.json().then((data) => {
                    let keys = Object.keys(data);
                    console.log(keys.length)

                    keys.forEach((key) => {
                        if (!isPersonIn(key)) {
                            let personRawData = data[key];
                            let personFullName = personRawData.full_fio;
                            let currentLocation = personRawData.config_tree_id;

                            currentPerson = new Person(key, personFullName, currentLocation);
                            PERSONS.push(currentPerson);
                        }
                    });
                    // console.log(PERSONS)
                });

            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

async function getStateDiffs() {
    let inner = await fetch("http://127.0.0.1:8080/location.json", { mode: 'same-origin' });
    let data = await inner.json();

    let keys = Object.keys(data);
    let diffPersonStates = [];

    keys.forEach((key) => {
        let personToCheck = isPersonIn(key);
        // нужно добавить человека в return, если его еще нет в PERSONS или если у него изменилась позиция

        let personRawData = data[key];

        if (!personToCheck) {
            //если человека еще нет
            let personFullName = personRawData.full_fio;
            let currentLocation = personRawData.config_tree_id;

            personToCheck = new Person(key, personFullName, currentLocation);
            diffPersonStates.push(personToCheck);
            // PERSONS.push(personToCheck);
        } else {
            PERSONS.forEach((person) => {
                if(person.ID == key) {
                    let currentLocation = personRawData.config_tree_id;

                    if(person.location == currentLocation) {
                        diffPersonStates.push(personToCheck);
                    }
                }
            })
        }
        
    })
    // console.log(diffPersonStates)
    return diffPersonStates;
}

class Cabinet {
    static destinationChecker = false;
    static personToMove;
    static placeholderToMoveFrom;
    static personEvent;

    constructor(cab, placeholder) {
        this.cab = cab;
        this.placeholder = placeholder;
    }

    static getCoeffs(cabinet) {
        let koeffs = [];
        for (let j = 0; j < cabinet.points.length; j++) {
            let currentPair = [];
            currentPair.push(cabinet.points[j].x / WID);
            currentPair.push(cabinet.points[j].y / HEI);
            koeffs.push(currentPair);
        }
        return koeffs
    }
}

function initCabinets() {
    let cabs = $(".svg-wrapper svg").children();
    let placeholders = $(".grid-map").children();
    for (let i = 0; i < cabs.length; i++) {
        CABINETS.push(new Cabinet(cabs[i], placeholders[i]))
    }
}

// input: HTML-element, HTML-element
function getDistance(obj1, obj2) {
    let objSize = obj1.getBoundingClientRect();
    let objSizeNext = obj2.getBoundingClientRect();

    return Math.sqrt(
        (objSize.x - objSizeNext.x) * (objSize.x - objSizeNext.x) +
        (objSize.y - objSizeNext.y) * (objSize.y - objSizeNext.y));
}

function getClosestCheckpoint(currentCheckpoint) {
    let closestCheckpoint = currentCheckpoint;
    let currDist;
    let tmpCheckpoint;
    let dist = Number.MAX_SAFE_INTEGER;

    for (let j = 0; j < CHECKPOINTS.length; j++) {
        tmpCheckpoint = CHECKPOINTS[j];
        if (tmpCheckpoint == currentCheckpoint) {
            continue;
        } else {
            currDist = getDistance(currentCheckpoint, tmpCheckpoint);
            if (currDist <= dist) {
                closestCheckpoint = tmpCheckpoint;
                dist = currDist;
            } else {
                // console.log(j)
                // console.log(CHECKPOINTS[j])
                // console.log("dist is: " + currDist)
            }
        }

    }

    return closestCheckpoint;
}

function getCheckpoint(number) {
    return ($('.checkPoint-' + number)[0]);
}

function movePerson(who, from, to) {
    who.stopPropagation(false);// как избавиться от этого?

    let path = [];

    let routeFinder = new FindShortRoute(roomMap);
    let pathStringsID = routeFinder.findRoute(from, to);


    pathStringsID.forEach(step => {
        path.push($(`.cab-${step}-place`)[0]);
    });
    console.log(path);

    // return;

    let x = $(who.target)[0].offsetLeft;
    let y = $(who.target)[0].offsetTop;
    let JQ_who = $(who.target).detach();

    JQ_who.appendTo($('.floor-4-wrapper'));
    JQ_who.offset({
        left: x,
        top: y
    });


    function animate({ timing, draw, duration }) {

        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            // timeFraction изменяется от 0 до 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // вычисление текущего состояния анимации
            let progress = timing(timeFraction);

            draw(progress); // отрисовать её ,progress==1

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        });
    }

    function moveByList() {
        // distanation points
        const list = path;
        moveClass.move(list);
    }

    class Move {
        static checker = false;
        /** index of active route step */
        index = 0;
        /** list with dest point */
        list;
        /** html node should move */
        movingNode;

        doneCallback;

        constructor(node) {
            this.movingNode = node;
        }

        /**
         * run move by route list
         */
        move(list) {
            this.index = 0;
            this.list = list;
            this._next();
            this.checker = true;
        }

        /**
         * Move to point
         */
        _moveToPoint(destinationPoint) {
            // save context for call next()
            const self = this;
            let nextCoordinates = destinationPoint.getBoundingClientRect();
            let x = nextCoordinates.x;
            let y = nextCoordinates.y;
            let correctionX = destinationPoint.offsetWidth / 2;
            let correctionY = destinationPoint.offsetHeight / 2;

            // calc move time
            const t = parseInt(self.movingNode.style.top) || 0;
            const l = parseInt(self.movingNode.style.left) || 0;
            let time = Math.sqrt((l - x) * (l - x) + (t - y) * (t - y)) * 2;

            animate({
                duration: time,
                draw(progress) {
                    const node = self.movingNode;
                    //get current position
                    const top = parseInt(node.style.top) || 0;
                    const left = parseInt(node.style.left) || 0;
                    //calculate transition
                    const xTrans = x - left + correctionX - 10;
                    const yTrans = y - top + correctionY - 10;
                    node.style.transform = `translate3d(${progress * (xTrans)
                        }px, ${progress * (yTrans)}px, 0)`;
                    if (progress === 1) {
                        // set finish position, reset transition
                        node.style.top = `${y + correctionY - 10}px`;
                        node.style.left = `${x + correctionX - 10}px`;
                        node.style.transform = ``;
                        self._next();
                    }
                },
                timing(a) {
                    return a;
                }
            });
        }

        /**
         * Run next step in route
         */
        _next() {
            const step = this.list[this.index];

            if (step) {
                // let nextCoordinates = step.getBoundingClientRect() || 0;
                this._moveToPoint(step);
            } else {
                if (typeof this.doneCallback === 'function') {
                    this.doneCallback();
                }
            }
            this.index++;
        }
    }

    const moveClass = new Move(JQ_who[0]);

    moveClass.doneCallback = () => {
        // здесь нужно подождать, пока произойдет анимация исчезания, прикрепить "прозрачный "
        // элемент к родителю и запустить анимацию появления
        JQ_who = $(who.target).detach();
        JQ_who.appendTo($(path[path.length - 1]));
        // состояние где маркер перешёл в другой кабинет
        // тут убрал бекграунд-колор и фильтр: брайтнесс ибо они перезаписывают цвет иконки

        JQ_who[0].attributes[1].nodeValue += "top: 0!important; left: 0!important; transform: none;";

    }

    moveByList();

    who.stopPropagation(true);
    Cabinet.to = false;
}

function getCabFromPlaceholder(placeholder) {

    for (let i = 0; i < CABINETS.length; i++) {
        let placeholderName = placeholder.classList[0];
        // для имен классов дивов с 2-мя или 1-ой цифрой
        if (placeholderName[6] == '-') {
            if (CABINETS[i].cab.id === placeholder.classList[0].slice(0, 6)) {
                return CABINETS[i];
            }
        } else {
            if (CABINETS[i].cab.id === placeholder.classList[0].slice(0, 5)) {
                return CABINETS[i];
            }
        }
    }
}

$('.placeholder').click((event) => {
    let curPlace = event.currentTarget;

    function randomColor() {
        let number = Math.floor(Math.random() * (10_777_215) + 3_000_000);
        return "#" + Number(number).toString(16)
    }

    // condition for KORIDOR PARADNAYA PRIHOZHAYA
    if (!Cabinet.to) {
        let person = document.createElement('div');
        let personObject = new Person(person);
        console.log(personObject);
        person.setAttribute("class", "person-icon");
        person.style = "background-color: " + randomColor();
        curPlace.appendChild(person);
    }

    $(".person-icon").on("click", (event) => {
        Cabinet.to = true;
        Cabinet.personToMove = event;
        // убрал эту строчку так как она перезаписывает картинку но для показа наверн сойдёт
        event.target.style += "background-color: #fbfbfb; filter: brightness(120%);";
    });
});

$(".move").on("click", (event) => {
    let fromPlaceholderName;
    let fromPlaceholder;
    let destinationPlaceholderName;
    let destinationPlaceholder;

    if (Cabinet.personToMove.currentTarget) {
        let we = $(".to input[type='radio']");
        for (let i = 0; i < we.length; i++) {
            if (we[i].checked) {
                destinationPlaceholderName = we[i].value;
            }
        }

        we = $(".from input[type='radio']");
        for (let i = 0; i < we.length; i++) {
            if (we[i].checked) {
                fromPlaceholderName = we[i].value;
            }
        }

        let fromIndex = fromPlaceholderName.slice(4, fromPlaceholderName.length - 5);
        fromPlaceholder = $(`.cab-${fromIndex}-place`)[0];

        let toIndex = destinationPlaceholderName.slice(4, destinationPlaceholderName.length - 3);
        destinationPlaceholder = $(`.cab-${toIndex}-place`)[0];

        movePerson(
            Cabinet.personToMove,
            fromIndex,
            toIndex
        )
    }
});

function personOnChangeState(person, fromID, toID) {

    // добавление человека в карту
    let curPlace = event.currentTarget;

    function randomColor() {
        let number = Math.floor(Math.random() * (10_777_215) + 3_000_000);
        return "#" + Number(number).toString(16)
    }

    // condition for KORIDOR PARADNAYA PRIHOZHAYA
    if (!Cabinet.to) {
        let person = document.createElement('div');
        let personObject = new Person(person);
        console.log(personObject);
        person.setAttribute("class", "person-icon");
        person.style = "background-color: " + randomColor();
        curPlace.appendChild(person);
    }

    $(".person-icon").on("click", (event) => {
        Cabinet.to = true;
        Cabinet.personToMove = event;
        // убрал эту строчку так как она перезаписывает картинку но для показа наверн сойдёт (делает маркер черным по клику)
        event.target.style += "background-color: #fbfbfb; filter: brightness(120%);";
    });

    // вызов движения
    let fromPlaceholderName;
    let fromPlaceholder;
    let destinationPlaceholderName;
    let destinationPlaceholder;

    if (Cabinet.personToMove.currentTarget) {
        let we = $(".to input[type='radio']");
        for (let i = 0; i < we.length; i++) {
            if (we[i].checked) {
                destinationPlaceholderName = we[i].value;
            }
        }

        we = $(".from input[type='radio']");
        for (let i = 0; i < we.length; i++) {
            if (we[i].checked) {
                fromPlaceholderName = we[i].value;
            }
        }

        let fromIndex = fromPlaceholderName.slice(4, fromPlaceholderName.length - 5);
        fromPlaceholder = $(`.cab-${fromIndex}-place`)[0];

        let toIndex = destinationPlaceholderName.slice(4, destinationPlaceholderName.length - 3);
        destinationPlaceholder = $(`.cab-${toIndex}-place`)[0];

        movePerson(
            Cabinet.personToMove,
            fromIndex,
            toIndex
        )
    }

}

// $('.preview').click(() => {

//     var el = document.getElementById("4-floor");
//     el.classList.remove("display");
//     el.classList.add("floor-4-map-display");

//     var el2 = document.getElementById("background");
//     el2.classList.add("map-texture");

//     var el3 = document.getElementById("grid-for-help");
//     el3.classList.remove("display");

//     var el4 = document.getElementById("intro");
//     el4.classList.add("text-display");
// })

$(document).ready(() => {
    // console.log("n");
    initCabinets();
    initPersons();
    // doSome();
    // console.log("n");
    // console.log(PERSONS);
    // doSome();
    // doSome();
    console.log(PERSONS);
    let timerId = setInterval(() => {
        // console.log("tik tak")
        console.log(PERSONS);
        doSome();
        console.log(PERSONS);
    }, 5000);
    setTimeout(() => { clearInterval(timerId); alert('stop'); }, 16000);
})

async function doSome() {

    await getStateDiffs().then(diffs => {
        if (diffs.length != 0) {
            // console.log("diffs true: ", Object.keys(diffs));

            let keys = Object.keys(diffs);
            // console.log("keys len: ", keys.length, " PERSONS len: ", PERSONS.length)

            keys.forEach((key) => {
                let currentPerson = diffs[key];

                if (!isPersonIn(currentPerson)) {
                    // если человек еще не создан (первый чек за день)
                    console.log("Новый человечек")
                    PERSONS.push(currentPerson);
                } else {
                    // если человек уже существует
                    PERSONS.forEach((person) => {
                        if (currentPerson.ID == person.ID) {
                            // если текущий человек (из массива изменений) равен человеку из уже существующих
                            if (!(currentPerson.location == person.location)) {
                                // если локация человека изменилась
                                console.log("person old location diff: " + person.location);
                                console.log("person new location diff: " + currentPerson.location);
                                person.location = currentPerson.location;
                                console.log("3")
                            } else {
                                // если локация прежняя
                                console.log("--")
                            }
                        }
                    })
                }
            })
        } else {
            console.log("----------no diffs commited-----------");
        }
    });

}
