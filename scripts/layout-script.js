const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = [];
CHECKPOINTS = [];
PERSONS = [];
FETCH_PATH = "http://itools.ispsystem.net/door/location?json"; //fetch(FETCH_PATH, { mode: 'same-origin' })
// FETCH_PATH = "http://127.0.0.1:8080/location.json?=";

// СДЕЛАТЬ АНИМАЦИЮ ИСЧЕЗНОВЕНИЯ ЭЛЕМЕНТА ПОСЛЕ ПРИХОДА В КОНЕЧНУЮ ТОЧКУ И ПЕРЕД АТТАЧЕМ


class Person {
    constructor(personID, personFullName, currentLocation) {
        this.ID = personID;
        this.fullName = personFullName;
        this.location = currentLocation;
        this.html = undefined;
    }
}

function isPersonIn(personID) {
    res = false
    PERSONS.forEach(element => {
        if (element.ID == personID) {
            // console.log(element)
            res = element;
        }
    });
    return res;
}

function initPersons() {
    fetch(FETCH_PATH, { mode: 'same-origin' })
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

                    keys.forEach((key) => {
                        if (!isPersonIn(key)) {
                            let personRawData = data[key];
                            let personFullName = personRawData.full_fio;
                            let currentLocation = personRawData.config_tree_id;

                            currentPerson = new Person(key, personFullName, currentLocation);

                            addNewPersonToMap(currentPerson);
                        }
                    });
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

async function getStateDiffs() {
    //http-request cash reboot
    let timeStamp = Date.now();

    let inner = await fetch(FETCH_PATH + timeStamp, { mode: 'same-origin' });
    let data = await inner.json();

    let keys = Object.keys(data);

    let resultData = new Map();
    let diffPersonStates = [];
    let newPersons = [];
    let deletedPersons = [];

    keys.forEach((key) => {
        let personToCheck = isPersonIn(key);

        let personRawData = data[key];

        if (!personToCheck) {
            //если человека еще нет
            let personFullName = personRawData.full_fio;
            let currentLocation = personRawData.config_tree_id;

            personToCheck = new Person(key, personFullName, currentLocation);
            newPersons.push(personToCheck);
        } else {
            PERSONS.forEach((person) => {
                if (person.ID == key) {
                    // console.log(personToCheck)
                    let currentLocation = personRawData.config_tree_id;
                    let personFullName = personRawData.full_fio;

                    personToCheck = new Person(key, personFullName, currentLocation);
                    personToCheck.html = person.html;

                    if (person.location != currentLocation) {
                        diffPersonStates.push(personToCheck);
                    }
                }
            })
        }

    })

    PERSONS.forEach((person) => {
        let checker = false; // человека нет
        keys.forEach((key) => {
            if (person.ID == key) {
                checker = true;
            }
        });
        if (!checker) {
            deletedPersons.push(person);
        }
    })
    // console.log(diffPersonStates)
    resultData.set("dif", diffPersonStates);
    resultData.set("new", newPersons);
    resultData.set("del", deletedPersons);
    return resultData;
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

function movePerson(who, from, to) {

    let path = [];
    // console.log(from)

    let routeFinder = new FindShortRoute(roomMap);
    let pathStringsID = routeFinder.findRoute(from, to);

    pathStringsID.forEach(step => {
        path.push($(`.cab-${step}-place`)[0]);
    });

    let x = $(who)[0].offsetLeft;
    let y = $(who)[0].offsetTop;

    let JQ_who = $(who).detach();
    JQ_who[0].style.position = "fixed";

    JQ_who.appendTo($('.preview'));

    JQ_who.offset({
        left: x - document.getElementsByClassName("floor-5-wrapper")[0].scrollLeft,
        top: y + window.scrollY
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
            let y = nextCoordinates.y + 0;//window.pageYOffset
            console.log("Next x: ", x)
            // console.log("next coords: ", nextCoordinates.y, " offY: ", window.pageYOffset);
            let correctionX = destinationPoint.offsetWidth / 2;
            let correctionY = destinationPoint.offsetHeight / 2;

            // calc move time
            const t = parseInt(self.movingNode.style.top) || 0;
            const l = parseInt(self.movingNode.style.left) || 0;
            let time = Math.sqrt((l - x) * (l - x) + (t - y) * (t - y)) * 10;

            animate({
                duration: time,
                draw(progress) {
                    const node = self.movingNode;
                    //get current position
                    const top = parseInt(node.style.top) || 0;
                    const left = parseInt(node.style.left) || 0;
                    //calculate transition
                    const xTrans = (x - left + correctionX - 10);
                    console.log("transX: ", xTrans, " left: ", left)
                    const yTrans = (y - top + correctionY - 10);
                    // console.log(yTrans)
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
        JQ_who[0].style.position = "relative";
        JQ_who = $(JQ_who[0]).detach();

        JQ_who.appendTo($("." + path[path.length - 1].classList[0]));
        JQ_who[0].style.top = 0;
        JQ_who[0].style.left = 0;
        JQ_who[0].style.transform = "none";

        // место для анимации
        let start = Date.now(); // запомнить время начала

        let timer_ = setInterval(function () {

            let timePassed = Date.now() - start;

            if (timePassed >= 2000) {
                clearInterval(timer_);
                startOpacityAnimation();
                return;
            }

            // отрисовать анимацию на момент timePassed, прошедший с начала анимации
            draw_start(timePassed);
        }, 20);

        // в то время как timePassed идёт от 0 до 2000
        // opacity изменяет значение от 1 до 0
        function draw_start(timePassed) {
            JQ_who[0].style.opacity = (1 - (timePassed / 20 / 100));
        }

        let startOpacityAnimation = () => {

            start = Date.now(); // запомнить время начала

            timer_ = setInterval(function () {

                let timePassed = Date.now() - start;

                if (timePassed >= 2000) {
                    clearInterval(timer_);
                    return;
                }

                // отрисовать анимацию на момент timePassed, прошедший с начала анимации
                draw_end(timePassed);
            }, 20);

            // в то время как timePassed идёт от 0 до 2000
            // opacity изменяет значение от 0 до 1
            function draw_end(timePassed) {
                JQ_who[0].style.opacity = (0 + (timePassed / 20 / 100));
            }
        }


    }

    moveByList();

    Cabinet.to = false;
}

function disappear(personHTML) {

    // место для анимации
    let start = Date.now(); // запомнить время начала

    let timer_ = setInterval(function () {

        let timePassed = Date.now() - start;

        if (timePassed >= 2000) {
            clearInterval(timer_);
            // удаление html-элемента
            personHTML = $(personHTML).detach();
            return;
        }

        // отрисовать анимацию на момент timePassed, прошедший с начала анимации
        draw_start(timePassed);
    }, 20);

    // в то время как timePassed идёт от 0 до 2000
    // opacity изменяет значение от 1 до 0
    function draw_start(timePassed) {
        personHTML.style.opacity = (1 - (timePassed / 20 / 100));
    }
}

function appear(personHTML) {

    // место для анимации
    let start = Date.now(); // запомнить время начала

    let timer_ = setInterval(function () {

        let timePassed = Date.now() - start;

        if (timePassed >= 2000) {
            clearInterval(timer_);
            personHTML.style.opacity = 1;
            return;
        }

        // отрисовать анимацию на момент timePassed, прошедший с начала анимации
        draw_start(timePassed);
    }, 20);

    // в то время как timePassed идёт от 0 до 2000
    // opacity изменяет значение от 1 до 0
    function draw_start(timePassed) {
        personHTML.style.opacity = (0 + (timePassed / 20 / 100));
    }
}

function addNewPersonToMap(person) {

    let strCabID = APItoLayoutMap[person.location].layoutName;

    let destinationPlaceholder = $("." + strCabID)[0];

    let personHTML = document.createElement('div');
    personHTML.setAttribute("class", "person-icon");
    personHTML.setAttribute("data-title", person.fullName);
    // перебираем
    FullnameArray = person.fullName.split(" ");
    FullName = "";
    FullnameArray.forEach((elem) => {
        FullName += elem;
    })

    try {
        // как убрать вывод ошибок??????
        fetch("http://127.0.0.1:8080/images/worker-icons/" + FullName + ".jpg", { mode: 'same-origin' })
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Image not found, error code: ' + response.status);

                        personHTML.style = "background-color: " + randomColor() + ";";
                        personHTML.style.opacity = 0;
                        person.html = personHTML;
                        PERSONS.push(person);

                        destinationPlaceholder.appendChild(personHTML);
                        appear(person.html);
                        return;
                    }

                    let path_ = "url(http://127.0.0.1:8080/images/worker-icons/" + FullName + ".jpg)";
                    personHTML.style.backgroundImage = path_;
                    person.html = personHTML;
                    personHTML.style.opacity = 0;

                    PERSONS.push(person);
                    destinationPlaceholder.appendChild(personHTML);
                    appear(person.html);
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    } catch (error) {
        personHTML.style = "background-color: " + randomColor() + ";";
        personHTML.style.opacity = 0;
        person.html = personHTML;

        PERSONS.push(person);
        destinationPlaceholder.appendChild(personHTML);
        appear(person.html);
    }
}

function deletePerson(person) {
    PERSONS = PERSONS.filter(person_ => person.ID != person_.ID);
    // запуск анимации исчезновения

    JQ_who = $(person.html)[0];
    // console.log(JQ_who);

    // // место для анимации
    // let start = Date.now(); // запомнить время начала

    // let timer_ = setInterval(function () {

    //     let timePassed = Date.now() - start;

    //     if (timePassed >= 2000) {
    //         clearInterval(timer_);
    //         // удаление html-элемента
    //         JQ_who = $(person.html).detach();
    //         return;
    //     }

    //     // отрисовать анимацию на момент timePassed, прошедший с начала анимации
    //     draw_start(timePassed);
    // }, 20);

    // // в то время как timePassed идёт от 0 до 2000
    // // opacity изменяет значение от 1 до 0
    // function draw_start(timePassed) {
    //     // console.log(JQ_who[0].style);
    //     JQ_who.style.opacity = (1 - (timePassed / 20 / 100));
    // }
    disappear(JQ_who);
}

function randomColor() {
    let number = Math.floor(Math.random() * (10_777_215) + 3_000_000);
    return "#" + Number(number).toString(16)
}

function personOnChangeState(person, from, to) {

    let strCabIDStart = APItoLayoutMap[from].layoutName;
    let strCabIDDestination = APItoLayoutMap[to].layoutName;

    let fromID = strCabIDStart.split("-")[1];
    let toID = strCabIDDestination.split("-")[1];

    movePerson(
        person.html,
        fromID,
        toID
    )
}

$('.preview').click(() => {

    var el = document.getElementById("4-floor");
    el.classList.remove("display");
    el.classList.add("floor-4-map-display");

    var el2 = document.getElementById("background");
    el2.classList.add("map-texture");

    var el3 = document.getElementById("grid-for-help");
    el3.classList.remove("display");

    var el4 = document.getElementById("intro");
    el4.classList.add("text-display");

    var el6 = document.getElementById("5floor-container");
    el6.classList.remove("existance");

    var el5 = document.getElementById("5-floor");
    el5.classList.remove("existance");
    el5.classList.add("floor-4-map-display");
})

$(document).ready(() => {
    initCabinets();
    initPersons();

    let timerId = setInterval(() => {
        checkPersonsStateChange();
        // console.log(window.pageYOffset);
    }, 5000);
})

async function checkPersonsStateChange() {

    await getStateDiffs().then(changedData => {
        if (changedData.length != 0) {

            let diffs = changedData.get("dif");
            let newPersons = changedData.get("new");
            let deletedPersons = changedData.get("del");

            newPersons.forEach((newPerson) => {
                addNewPersonToMap(newPerson);
            });

            diffs.forEach((diffPerson) => {
                let from, to;
                PERSONS.forEach((person) => {
                    if (person.ID == diffPerson.ID) {
                        from = person.location;
                        to = diffPerson.location;
                        person.location = diffPerson.location;
                        diffPerson = person;
                    }
                })
                personOnChangeState(diffPerson, from, to);
            });

            deletedPersons.forEach((delPerson) => {
                deletePerson(delPerson);
            })
        } else {
            console.log("----------no diffs commited-----------");
        }
    });
}
