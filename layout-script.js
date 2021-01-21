
class Cabinet {

    constructor(cab, params) {
        this.cab = cab;
        this.params = params;
    }
}

let wid = 1280;
let hei = 688;

let cabTest = []
cabTest.push($("#cab-1")[0]);
cabTest.push($("#cab-2")[0]);
cabTest.push($("#cab-3")[0]);
cabTest.push($("#cab-4")[0]);
cabTest.push($("#cab-5")[0]);
cabTest.push($("#cab-6")[0]);
cabTest.push($("#cab-7")[0]);
cabTest.push($("#cab-8")[0]);
cabTest.push($("#cab-9")[0]);
cabTest.push($("#cab-10")[0]);
cabTest.push($("#cab-11")[0]);
cabTest.push($("#cab-12")[0]);
cabTest.push($("#cab-13")[0]);
cabTest.push($("#cab-14")[0]);
cabTest.push($("#cab-15")[0]);
cabTest.push($("#cab-16")[0]);


let allKoeffs =[];
for (let i = 0; i < cabTest.length; i++) {
    let koeffs =[];
    for (let j = 0; j < cabTest[i].points.length; j++) {
        let currentPair = [];

        currentPair.push(cabTest[i].points[j].x / wid);
        currentPair.push(cabTest[i].points[j].y / hei);
        koeffs.push(currentPair);
    }
    allKoeffs.push(koeffs)
}


function resizeCabs() {
    // clientWidth = document.documentElement.clientWidth; //1280
    // clientHeight = document.documentElement.clientHeight; //688


    let level_4_svg_wapper_width = $(".svg-wrapper").width();
    let level_4_svg_wapper_height = $(".svg-wrapper").height();
    let cabs = []

    let cab_1  = new Cabinet(cabTest[0], allKoeffs[0]);
    let cab_2  = new Cabinet(cabTest[1], allKoeffs[1]);
    let cab_3  = new Cabinet(cabTest[2], allKoeffs[2]);
    let cab_4  = new Cabinet(cabTest[3], allKoeffs[3]);
    let cab_5  = new Cabinet(cabTest[4], allKoeffs[4]);
    let cab_6  = new Cabinet(cabTest[5], allKoeffs[5]);
    let cab_7  = new Cabinet(cabTest[6], allKoeffs[6]);
    let cab_8  = new Cabinet(cabTest[7], allKoeffs[7]);
    let cab_9  = new Cabinet(cabTest[8], allKoeffs[8]);
    let cab_10 = new Cabinet(cabTest[9], allKoeffs[9]);
    let cab_11 = new Cabinet(cabTest[10], allKoeffs[10]);
    let cab_12 = new Cabinet(cabTest[11], allKoeffs[11]);
    let cab_13 = new Cabinet(cabTest[12], allKoeffs[12]);
    let cab_14 = new Cabinet(cabTest[13], allKoeffs[13]);
    let cab_15 = new Cabinet(cabTest[14], allKoeffs[14]);
    let cab_16 = new Cabinet(cabTest[15], allKoeffs[15]);

    cabs.push(cab_1);
    cabs.push(cab_2);
    cabs.push(cab_3);
    cabs.push(cab_4);
    cabs.push(cab_5);
    cabs.push(cab_6);
    cabs.push(cab_7);
    cabs.push(cab_8);
    cabs.push(cab_9);
    cabs.push(cab_10);
    cabs.push(cab_11);
    cabs.push(cab_12);
    cabs.push(cab_13);
    cabs.push(cab_14);
    cabs.push(cab_15);
    cabs.push(cab_16);

    for(let i = 0; i < cabs.length; i++) {
        let tmpCab = cabs[i];

        for(let j = 0; j < tmpCab.params.length; j++) {
            tmpCab.cab.points[j].x = tmpCab.params[j][0] * level_4_svg_wapper_width;
            tmpCab.cab.points[j].y = tmpCab.params[j][1] * level_4_svg_wapper_height;
        }
    }

}

$('.cab').click((event) => {
    let clickedCab = event.currentTarget;
    console.log(event.currentTarget.style="opacity: 1")
});

$('.placeholder').click((event) => {

  let curPlace = event.currentTarget;
  // condition for KORIDOR PARADNAYA PRIHOZHAYA
  if(curPlace.classList[0] == "cab-1-1-place" || curPlace.classList[0] == "cab-1-2-place") {

    let child1 = $('.cab-1-1-place')[0];
    let child2 = $('.cab-1-2-place')[0];

    let person = document.createElement('div');
    person.setAttribute("class", "person-icon");
    person.style="background-color: black; height: 30px; width: 30px; border-radius: 50%; margin: 0.5em;"

    if(child1.children.length >= child2.children.length){
      child2.appendChild(person);
    } else {
      child1.appendChild(person);
    }
    
  } else {
    let person = document.createElement('div');
    person.setAttribute("class", "person-icon");
    person.style="background-color: black; height: 30px; width: 30px; border-radius: 50%; margin: 0.5em;"
  
    curPlace.appendChild(person);
  }
});

$(document).ready(() => {
    resizeCabs();
})

window.onresize = function( event ) {
    resizeCabs();
};