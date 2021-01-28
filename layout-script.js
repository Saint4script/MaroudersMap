const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = []
let CHECKPOINTS = []

class Cabinet {
    static destinationChecker = false;
    static personToMove;
    static placeholderToMoveFrom;
    static personEvent;

    constructor(cab, coeffs) {
        this.cab = cab;
        this.coeffs = coeffs;
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
    for(let i = 0; i < cabs.length; i++) {
        CABINETS.push(new Cabinet(cabs[i], Cabinet.getCoeffs(cabs[i])))
    }
}
function initCheckpoints() {
    CHECKPOINTS = $(".grid-map").children(".checkpoint");
}

function resizeCabs() {

    let level_4_svg_wapper_width = $(".svg-wrapper").width();
    let level_4_svg_wapper_height = $(".svg-wrapper").height();

    for(let i = 0; i < CABINETS.length; i++) {
        let tmpCab = CABINETS[i];

        for(let j = 0; j < tmpCab.coeffs.length; j++) {
            tmpCab.cab.points[j].x = tmpCab.coeffs[j][0] * level_4_svg_wapper_width;
            tmpCab.cab.points[j].y = tmpCab.coeffs[j][1] * level_4_svg_wapper_height;
        }
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

function getClosestCheckpoint() {
    let closestCheckpoint;
    for(let i = 0; i < CHECKPOINTS.length; i++) {
        let currCheckpoint = CHECKPOINTS[i];
        let currCheckpointNext = CHECKPOINTS[i+1];
        let currDist = getDistance(currCheckpoint, currCheckpointNext);
        for(let j = 0; j < CHECKPOINTS.length; j++ ) {
            let tmpCheckpoint = CHECKPOINTS[j];
            let dist = getDistance(currCheckpoint, tmpCheckpoint);
            if( dist <= currDist) {
                closestCheckpoint = tmpCheckpoint;
            }
        }
    }
    return closestCheckpoint;
}


function movePerson(who, from, to) {
    console.log(who)
    who.stopPropagation(false);// как избавиться от этого?
    let passedCheckpoints = [];
        
    // defining first checkpoint
    let placeholderName = to.classList[0];
    let placeholderNumber = placeholderName.split('-')[1];
    let startCheckpoint;

    // getting first checkpoint
    for(let i = 0; i < CHECKPOINTS.length; i++) {
        if(Number(CHECKPOINTS[i].classList[0].split('-')[1]) == Number(placeholderNumber)) {
            startCheckpoint = CHECKPOINTS[i];
            break;
        }
    }
    //get last checkpoint !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    passedCheckpoints.push(startCheckpoint);

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
            const list = CHECKPOINTS;
            const moveClass = new Move(JQ_who[0]);
            moveClass.move(list);
        }
        // console.log(JQ_who[0].style.top)

        class Move {
            /** index of active route step */
            index = 0;
            /** list with dest point */
            list;
            /** html node should move */
            movingNode;
        
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
                }
                this.index++;
            }
        }
        

        moveByList();
    // }

    JQ_who[0].attributes[1].nodeValue+="background-color: black; filter: brightness(120%);";
    
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
        Cabinet.placeholderToMoveFrom = curEvent;
    });
});

$(".move").on("click", (event) => {
    // Cabinet.destinationChecker = true;
    // if(Cabinet.destinationChecker) {
    //     move(event, curPlace);
    //     Cabinet.destinationChecker = false;
    // }
    let destinationPlaceholderName;
    let destinationPlaceholder;
    if(Cabinet.personToMove.currentTarget) {
        let we = $("input[type='radio'");
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
        
        movePerson(
            Cabinet.personToMove,
            Cabinet.placeholderToMoveFrom,
            destinationPlaceholder
            )
    }
});

$(document).ready(() => {
    initCheckpoints();
    initCabinets();
    resizeCabs();
})

window.onresize = function( event ) {
    resizeCabs();
};