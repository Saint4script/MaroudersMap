const WID = 1280;// ширина - для отношений с полигонами
const HEI = 688;// высота
CABINETS = []
let CHECKPOINTS = []

class Cabinet {
    destinationChecker = false

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

$('.checkpoint').click((event) => {
    console.log("f")
});

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

function move(event, destination) {
    event.stopPropagation(false);// как избавиться от этого?
    let passedCheckpoints = []

    // defining start checkpoint
    let placeholderName = destination.classList[0];
    let placeholderNumber = placeholderName.split('-')[1];
    let startCheckpoint;
    let startCheckpointName;

    for(let i = 0; i < CHECKPOINTS.length; i++) {
        if(Number(CHECKPOINTS[i].classList[0].split('-')[1]) == Number(placeholderNumber)) {
            startCheckpoint = CHECKPOINTS[i];
            console.log(startCheckpoint);
            break;
        }
    }

    let objSizeNext = obj2.getBoundingClientRect();
    
    let me = event.currentTarget;

    let size = me.getBoundingClientRect();
    let stepX = 50;
    let stepY = 50;

    size.x += stepX;
    size.y += stepY;
    me.style+=`position: absolute; ; transition: 1s ease-out; transform: translate(${size.x}px, ${size.y}px)`;

    event.stopPropagation(true);
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
    if(!Cabinet.destinationChecker) {
        curPlace = event.currentTarget;
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
    } else {
        $(".person-icon").on("click", (event) => {
            move(event, curPlace);
            Cabinet.destinationChecker = true;
        });
    }
    $(".person-icon").on("click", (event) => {
        Cabinet.destinationChecker = true;
    });
});



$(document).ready(() => {
    initCheckpoints();
    initCabinets();
    resizeCabs();
})

window.onresize = function( event ) {
    resizeCabs();
};