let clientWidth;
let clientHeight;

class Cabinet {

// object typeof Polygon, array of floats
  constructor(cab, params) {
    this.cab = cab;
    this.params = params;
  }
}

function resizeCabs() {
  // clientWidth = document.documentElement.clientWidth; //1280
  // clientHeight = document.documentElement.clientHeight; //688
  let level_4_svg_wapper_width = $(".svg-wrapper").width();
  let level_4_svg_wapper_height = $(".svg-wrapper").height();
  let cabs = []

  let cab_10 = new Cabinet($("#cab-10")[0], [[0,0], [0.51,0], [0.51, 0.04], [0.546, 0.04], [0.546, 0.487], [0,0.487]])
  cabs.push(cab_10);
  
  let cab_5 = new Cabinet($("#cab-5")[0], [[0.507,0], [0.79,0], [0.79, 0.107], [0.714, 0.107], [0.714, 0.385], [0.603, 0.389], [0.603, 0.487], [0.547, 0.487], [0.547, 0.04], [0.507, 0.04]])
  cabs.push(cab_5);

  let cab_7 = new Cabinet($("#cab-7")[0], [[0.79,0], [0.883,0], [0.883, 0.107], [0.79, 0.107]])
  cabs.push(cab_7);


  for(let i = 0; i < cabs.length; i++) {

    let tmpCab = cabs[i];

    for(let j = 0; j < tmpCab.params.length; j++) {
      tmpCab.cab.points[j].x = tmpCab.params[j][0] * level_4_svg_wapper_width;
      tmpCab.cab.points[j].y = tmpCab.params[j][1] * level_4_svg_wapper_height;
    }
  }

}

$('.cab').click((event) => {
  // console.log(event.currentTarget);
  let clickedCab = event.currentTarget;
  console.log(event.currentTarget.style="opacity: 1")
  // clickedCab.;
});


$(document).ready(() => {
  resizeCabs();
})

window.onresize = function( event ) {
    resizeCabs();
};