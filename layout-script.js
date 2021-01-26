const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = []


let CHECKPOINTS = []

class Cabinet {
    static destinationChecker = false;
    static personToMove;
    static placeholderToMoveFrom;
    static personEvent;

    /* В данный момент не используется и вряд ли будет
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
    }*/
}

/* В данный момент не используется и вряд ли будет
function initCabinets() {
    let cabs = $(".svg-wrapper svg").children();
    for(let i = 0; i < cabs.length; i++) {
        CABINETS.push(new Cabinet(cabs[i], Cabinet.getCoeffs(cabs[i])))
    }
}*/


/* В данный момент не используется и вряд ли будет
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
}*/

function initCheckpoints() {
    CHECKPOINTS = $(".grid-map").children(".checkpoint");
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


function move(who, from, to) {
    who.stopPropagation(false);// как избавиться от этого?
    let passedCheckpoints = [];
        
    function frame(obj, toX, toY) {
        let me = $(obj.target)[0];
        if (me.offsetLeft == toX && me.offsetTop == toY) {
            clearInterval(time);
        } else {
            $(obj.target).offset ( {
                left: me.offsetLeft + 1,
                top: me.offsetTop + 1
            });
        }
    }
    // defining first checkpoint
    let placeholderName = to.classList[0];
    let placeholderNumber = placeholderName.split('-')[1];
    let startCheckpoint;
    // let startCheckpointName;

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

    console.log(CHECKPOINTS)

    for(let i = 0; i < CHECKPOINTS.length; i++) {

        let nextCoordinates = CHECKPOINTS[i].getBoundingClientRect();

        // let tmpX = (nextCoordinates.x - $(who.target)[0].offsetLeft) / 100;
        // let tmpY = (nextCoordinates.y - $(who.target)[0].offsetTop) / 100;
        // let time = setInterval(() => {
        //     if ($(who.target)[0].offsetLeft == nextCoordinates.x && $(who.target)[0].offsetTop == nextCoordinates.y) {
        //             clearInterval(time);
        //     } else {
                
        //         x = $(who.target)[0].offsetLeft + tmpX;
        //         y = $(who.target)[0].offsetTop + tmpY;
                // $(who.target).offset ( {
                //     left: x,
                //     top: y
                // });
                
        //     }
        // }, 1000);


        let tmpX = (nextCoordinates.x - $(who.target)[0].offsetLeft);
        let tmpY = (nextCoordinates.y - $(who.target)[0].offsetTop);
        // console.log("$(who.target)[0].offsetLeft: " + $(who.target)[0].offsetLeft + "$(who.target)[0].offsetTop: " + $(who.target)[0].offsetTop);
        // console.log("nextCoordinates.x: " + nextCoordinates.x + "nextCoordinates.y: " + nextCoordinates.y);
        // console.log("tmpX: " + tmpX + "tmpY: " + tmpY);
        
        setTimeout(() => {
            JQ_who.style+=`position: absolute; transition: 1s ease-out; transform: translate(${tmpX}px, ${tmpY}px)`;
        }, 1000);
        setTimeout(() => {
            $(who.target).offset ( {
                left: nextCoordinates.x,
                top: nextCoordinates.y
            });
        }, 1000);
        JQ_who.style+=`position: absolute; transition: 10s ease-out; transform: translate(0px, 0px)`;
        
        
    }

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

    $(".person-icon").on("click", (event) => {
        Cabinet.personToMove = event;
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
        
        move(
            Cabinet.personToMove,
            Cabinet.placeholderToMoveFrom,
            destinationPlaceholder
            )
    }
});

$(document).ready(() => {
    initCheckpoints();
    /*initCabinets();
    resizeCabs();*/
})

/*window.onresize = function( event ) {
    resizeCabs();
};*/
