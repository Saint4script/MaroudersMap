const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = [];
CHECKPOINTS = [];


// ПЕРЕДЕЛАТЬ АПИ ПОД ТО, ЧТО У НАС НЕТ ТОЧКИ, ОТКУДА МЫ ИДЕМ ( ЭТО ПРОШЛАЯ КТ )
ROUTES = new Map();

CAB_16_ROUTES = new Map();


CAB_16_ROUTES.set("1", ["16-1", "16", "003", "004"]);// выход с этажа
CAB_16_ROUTES.set("2", ["16-1", "16", "003", "2"]);
CAB_16_ROUTES.set("3", ["16-1", "16", "003", "3"]);
CAB_16_ROUTES.set("4", ["16-1", "16", "003", "4"]);
CAB_16_ROUTES.set("5", ["16-1", "16", "002", "5", "5-1"]);
CAB_16_ROUTES.set("6", ["16-1", "16", "003", "6"]);
CAB_16_ROUTES.set("7", ["16-1", "16", "002", "5", "5-1", "5-2", "7"]);
CAB_16_ROUTES.set("8", ["16-1", "16", "8"]);
CAB_16_ROUTES.set("9", ["16-1", "16", "002", "000", "001", "9"]);
CAB_16_ROUTES.set("10", ["16-1", "16", "002", "000", "10", "10-1"]);
CAB_16_ROUTES.set("11", ["16-1", "16", "002", "000", "001", "12", "11"]);
CAB_16_ROUTES.set("12", ["16-1", "16", "002", "000", "001", "12", "12-1"]);
CAB_16_ROUTES.set("13", ["16-1", "16", "002", "000", "001", "12", "12-1", "12-2", "12-3", "13"]);
CAB_16_ROUTES.set("14", ["16-1", "16", "002", "000", "001", "12", "12-1", "14"]);
CAB_16_ROUTES.set("15", ["16-1", "16", "002", "000", "001", "15"]);


ROUTES.set("16", CAB_16_ROUTES);

CAB_10_ROUTES = new Map(); 

CAB_10_ROUTES.set("2", ["10-1", "10", "000", "002", "003", "2"]);
CAB_10_ROUTES.set("3", ["10-1", "10", "000", "002", "003", "3"]);
CAB_10_ROUTES.set("4", ["10-1", "10", "000", "002", "003", "4"]);
CAB_10_ROUTES.set("5", ["10-1", "10", "000", "5", "5-1"]);
CAB_10_ROUTES.set("6", ["10-1", "10", "000", "002", "003", "6"]);
CAB_10_ROUTES.set("7", ["10-1", "10", "000", "5", "5-1", "5-2", "7"]);
CAB_10_ROUTES.set("8", ["10-1", "10", "000", "002", "8"]);
CAB_10_ROUTES.set("9", ["10-1", "10", "001", "9"]);
CAB_10_ROUTES.set("11", ["10-1", "10", "001", "12", "11"]);
CAB_10_ROUTES.set("12", ["10-1", "10", "001", "12", "12-1"]);
CAB_10_ROUTES.set("13", ["10-1", "10", "001", "12", "12-1", "12-2", "12-3", "13"]);
CAB_10_ROUTES.set("14", ["10-1", "10", "001", "12", "12-1", "14"]);
CAB_10_ROUTES.set("15", ["10-1", "10", "001", "15"]);
CAB_10_ROUTES.set("16", ["10-1", "10", "000", "002", "16", "16-1"]);

ROUTES.set("10", CAB_10_ROUTES);


CAB_13_ROUTES = new Map(); 

CAB_13_ROUTES.set("11", ["13", "12-3", "12-1", "11"]);
CAB_13_ROUTES.set("14", ["13", "12-3", "12-2", "14"]);

ROUTES.set("13", CAB_13_ROUTES);

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
    
    let pathStringsID = ROUTES.get(pathFromID).get(pathToID);
    for(let i = 0; i < pathStringsID.length; i++) {
        path.push($('.checkPoint-'+pathStringsID[i])[0]);
    }
    console.log(path);

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
            let animTime = 1000;
            // save context for call next()
            const self = this;
            animate({
                duration: animTime,
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
                        // set finish posotion, reset transition
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
        JQ_who = $(who.target).detach();
        JQ_who.appendTo($(to));
        JQ_who[0].attributes[1].nodeValue+="background-color: black; filter: brightness(120%); top: 0!important; left: 0!important; transform: none;";
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
    let curEvent = event;
    let curPlace = event.currentTarget;
    // console.log(Cabinet.destinationChecker)

    // curPlace = event.currentTarget;
    // condition for KORIDOR PARADNAYA PRIHOZHAYA
    if(!Cabinet.to) {
        if(curPlace.classList[0] == "cab-1-1-place" || curPlace.classList[0] == "cab-1-2-place") {

            let child1 = $('.cab-1-1-place')[0];
            let child2 = $('.cab-1-2-place')[0];

            let person = document.createElement('div');
            person.setAttribute("class", "person-icon");

            if(child1.children.length >= child2.children.length){
                child2.appendChild(person);
            } else {
                child1.appendChild(person);
            }

        } else {
            let person = document.createElement('div');
            person.setAttribute("class", "person-icon");

            curPlace.appendChild(person);
        }
    }


    $(".person-icon").on("click", (event) => {
        Cabinet.to = true;
        Cabinet.personToMove = event;
        event.target.style="background-color: #fbfbfb; filter: brightness(120%);";
    });
});

$(".move").on("click", (event) => {
    // Cabinet.destinationChecker = true;
    // if(Cabinet.destinationChecker) {
    //     move(event, curPlace);
    //     Cabinet.destinationChecker = false;
    // }
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

$(document).ready(() => {
    initCheckpoints();
    initCabinets();
})

window.onresize = function( event ) {
    
};
