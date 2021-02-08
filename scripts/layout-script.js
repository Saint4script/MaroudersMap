const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = [];
CHECKPOINTS = [];

// ПЕРЕДЕЛАТЬ АПИ ПОД ТО, ЧТО У НАС НЕТ ТОЧКИ, ОТКУДА МЫ ИДЕМ ( ЭТО ПРОШЛАЯ КТ )
// СДЕЛАТЬ АНИМАЦИЮ ИСЧЕЗНОВЕНИЯ ЭЛЕМЕНТА ПОСЛЕ ПРИХОДА В КОНЕЧНУЮ ТОЧКУ И ПЕРЕД АТТАЧЕМ

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
        let koeffs =[];
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
    for(let i = 0; i < cabs.length; i++) {
        CABINETS.push(new Cabinet(cabs[i], placeholders[i]))
    }
}
function initCheckpoints() {
    CHECKPOINTS = $(".grid-map").children(".checkpoint");
    // console.log(CHECKPOINTS)
}

// input: HTML-element, HTML-element
function getDistance(obj1, obj2) {
    let objSize = obj1.getBoundingClientRect();
    let objSizeNext = obj2.getBoundingClientRect();
    // console.log("x1: " + objSize.x + " y1: " + objSize.y + " x2: " + objSizeNext.x + " y2: " + objSizeNext.y)
    return Math.sqrt(
        (objSize.x - objSizeNext.x) * (objSize.x - objSizeNext.x) +
        (objSize.y - objSizeNext.y) * (objSize.y - objSizeNext.y));
}

function getClosestCheckpoint(currentCheckpoint) {
    let closestCheckpoint = currentCheckpoint;
    let currDist;
    let tmpCheckpoint;
    let dist = Number.MAX_SAFE_INTEGER;

    for(let j = 0; j < CHECKPOINTS.length; j++ ) {
        tmpCheckpoint = CHECKPOINTS[j];
        if(tmpCheckpoint == currentCheckpoint) {
            continue;
        } else {
            currDist = getDistance(currentCheckpoint, tmpCheckpoint);
            if(currDist <= dist) {
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
    return($('.checkPoint-' + number)[0]);
}

function movePerson(who, from, to) {
    who.stopPropagation(false);// как избавиться от этого?

    let path = [];

    let pathFromID = from.classList[0].split('-')[1];
    let pathToID = to.classList[0].split('-')[1];
    
    // при перемещении из 1 в 1, то нужно выкидывать на лестницу, а не в 1 каб (ну либо по блокам 1-1, 1-2)
    if(from.classList[0] == "cab-1-place") {

        let jq_who = $(who.target);
        let jq_whoParentNode = jq_who.parent()[0];

        if(jq_whoParentNode.classList[0] == "cab-1-1-place") {

            let pathStringsID = ROUTES.get("1_1").get(pathToID);

            for(let i = 0; i < pathStringsID.length; i++) {
                path.push($('.checkPoint-'+pathStringsID[i])[0]);
            }
        } else if (jq_whoParentNode.classList[0] == "cab-1-2-place") {
            console.log(pathToID);
            console.log(ROUTES.get("1_2"));
            let pathStringsID = ROUTES.get("1_2").get(pathToID);

            for(let i = 0; i < pathStringsID.length; i++) {
                path.push($('.checkPoint-'+pathStringsID[i])[0]);
            }
        }

    }else {
        let pathStringsID = ROUTES.get(pathFromID).get(pathToID);

        for(let i = 0; i < pathStringsID.length; i++) {
            path.push($('.checkPoint-'+pathStringsID[i])[0]);
        }
    }

    // removing person-item from parent to make it able to move 
    let x = $(who.target)[0].offsetLeft;
    let y = $(who.target)[0].offsetTop;
    let JQ_who = $(who.target).detach();

    JQ_who.appendTo($('.floor-4-wrapper'));
    JQ_who.offset ( {
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
    // console.log(JQ_who[0].style.top)

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
        _moveToPoint(x, y) {
            // save context for call next()
            const self = this;
            // calc move time
            const t = parseInt(self.movingNode.style.top) || 0;
            const l = parseInt(self.movingNode.style.left) || 0;
            let time = Math.sqrt((l-x) * (l-x) + (t-y) * (t-y)) * 25;
            animate({
                duration: time,
                draw(progress) {
                    const node = self.movingNode;
                    //get current position
                    const top = parseInt(node.style.top) || 0;
                    const left = parseInt(node.style.left) || 0;
                    //calculate transition
                    const xTrans = x - left;
                    const yTrans = y - top;
                    node.style.transform = `translate3d(${
                        progress * (xTrans)
                    }px, ${progress * (yTrans)}px, 0)`;
                    if (progress === 1) {
                        // set finish position, reset transition
                        node.style.top = `${y}px`;
                        node.style.left = `${x}px`;
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
                let nextCoordinates = step.getBoundingClientRect() || 0;
                this._moveToPoint(nextCoordinates.x, nextCoordinates.y);
            } else {
                if ( typeof this.doneCallback === 'function') {
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
        JQ_who.appendTo($(to));
        // состояние где маркер перешёл в другой кабинет
        // тут убрал бекграунд-колор и фильтр: брайтнесс ибо они перезаписывают цвет иконки

        JQ_who[0].attributes[1].nodeValue+="top: 0!important; left: 0!important; transform: none;";
        console.log(JQ_who[0].attributes[1].nodeValue)
    }


    moveByList();

    who.stopPropagation(true);
    Cabinet.to = false;
}

function getCabFromPlaceholder(placeholder) {

    for(let i = 0; i < CABINETS.length; i++) {
        let placeholderName = placeholder.classList[0];
        // для имен классов дивов с 2-мя или 1-ой цифрой
        if(placeholderName[6] == '-') {
            if(CABINETS[i].cab.id === placeholder.classList[0].slice(0, 6)) {
                return CABINETS[i];
            }
        } else {
            if(CABINETS[i].cab.id === placeholder.classList[0].slice(0, 5)) {
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
    if(!Cabinet.to) {
        if(curPlace.classList[0] == "cab-1-1-place" || curPlace.classList[0] == "cab-1-2-place") {

            let child1 = $('.cab-1-1-place')[0];
            let child2 = $('.cab-1-2-place')[0];

            let person = document.createElement('div');
            person.setAttribute("class", "person-icon");

            if(child1.children.length >= child2.children.length){
                person.style = "background-color: " + randomColor();
                child2.appendChild(person);
            } else {
                person.style = "background-color: " + randomColor();
                child1.appendChild(person);
            }

        } else {
            let person = document.createElement('div');
            person.setAttribute("class", "person-icon");
            person.style = "background-color: " + randomColor();
            curPlace.appendChild(person);
        }
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

    if(Cabinet.personToMove.currentTarget) {
        let we = $(".to input[type='radio']");
        for(let i = 0; i < we.length; i++) {
            if(we[i].checked) {
                destinationPlaceholderName = we[i].value;
            }
        }
        if(destinationPlaceholderName[6] == '-') {
            destinationPlaceholder = $(`.${destinationPlaceholderName.slice(0, 7)}` + "place")[0];
        } else {
            destinationPlaceholder = $(`.${destinationPlaceholderName.slice(0, 6)}` + "place")[0];
        }

        we = $(".from input[type='radio']");
        for(let i = 0; i < we.length; i++) {
            if(we[i].checked) {
                fromPlaceholderName = we[i].value;
            }
        }

        if(fromPlaceholderName[6] == '-') {
            fromPlaceholder = $(`.${fromPlaceholderName.slice(0, 7)}` + "place")[0];
        } else {
            fromPlaceholder = $(`.${fromPlaceholderName.slice(0, 6)}` + "place")[0];
        }

        movePerson(
            Cabinet.personToMove,
            fromPlaceholder,
            destinationPlaceholder
        )
    }
});

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
})

$(document).ready(() => {
    initCheckpoints();
    initCabinets();
})
