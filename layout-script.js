
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


    let cab_10 = new Cabinet($("#cab-10")[0], [[0, 0], [0.5078125,0], [0.5078125, 0.0406976],
        [0.546875, 0.0406976], [0.546875, 0.4869186], [0,0.4869186]])
    cabs.push(cab_10);


    let cab_5 = new Cabinet($("#cab-5")[0], [[0.5078125,0], [0.790625,0], [0.790625, 0.1075581],
        [0.7148437, 0.1075581], [0.7148437, 0.3851744], [0.603125, 0.3851744], [0.5921875, 0.4869186], [0.546875, 0.4869186],
        [0.546875, 0.0406976], [0.5078125, 0.0406976]])
    cabs.push(cab_5);


    let cab_7 = new Cabinet($("#cab-7")[0], [[0.790625,0], [0.8835937,0], [0.8835937, 0.1075581], [0.790625, 0.1075581]])
    cabs.push(cab_7);


    let cab_2 = new Cabinet($("#cab-2")[0], [[0.8835937,0], [1,0], [1,0.4869186], [0.9398437, 0.4869186],
        [0.9398437, 0.247093], [0.8835937, 0.247093]])
    cabs.push(cab_2);


    let cab_6 = new Cabinet($("#cab-6")[0], [[0.7148437, 0.1075581], [0.790625, 0.1075581], [0.790625, 0.2107558],
        [0.8085937, 0.2107558], [0.8085937, 0.4869186], [0.7265625, 0.4869186] ,[0.7148437, 0.3851744]])
    cabs.push(cab_6);


    let cab_3 = new Cabinet($("#cab-3")[0], [[0.790625, 0.1075581], [0.8835937, 0.1075581], [0.8835937, 0.247093],
        [0.9398437, 0.247093], [0.9398437, 0.3851744], [0.8648437, 0.3851744], [0.8648437, 0.4869186], [0.8085937, 0.4869186],
        [0.8085937, 0.2107558], [0.790625, 0.2107558]])
    cabs.push(cab_3);


    let cab_8 = new Cabinet($("#cab-8")[0],[[0.603125, 0.3851744], [0.7148437, 0.3851744], [0.7351562, 0.559593], [0.5835937, 0.559593]])
    cabs.push(cab_8);


    let cab_4 = new Cabinet($("#cab-4")[0], [[0.8648437, 0.3851744], [0.9398437, 0.3851744], [0.9398437, 0.4869186], [0.8648437, 0.4869186]])
    cabs.push(cab_4);


    let cab_13 = new Cabinet($("#cab-13")[0], [[0, 0.4869186], [0.1460937, 0.4869186], [0.1460937, 0.6642441], [0, 0.6642441]])
    cabs.push(cab_13);


    let cab_14 = new Cabinet($("#cab-14")[0],[[0.1460937, 0.4869186], [0.2851562, 0.4869186], [0.2851562, 0.6642441], [0.1460937, 0.6642441]])
    cabs.push(cab_14);


    let cab_11 = new Cabinet($("#cab-11")[0], [[0.2851562, 0.4869186], [0.340625, 0.4869186], [0.340625, 0.6642441], [0.2851562, 0.6642441]])
    cabs.push(cab_11);


    let cab_9 = new Cabinet($("#cab-9")[0], [[0.340625, 0.4869186], [0.4335937, 0.4869186], [0.4335937, 0.6642441], [0.340625, 0.6642441]])
    cabs.push(cab_9);


    let cab_12 = new Cabinet($("#cab-12")[0], [[0, 0.6642441], [0.2851562, 0.6642441], [0.2851562, 1], [0, 1]])
    cabs.push(cab_12);


    let cab_15 = new Cabinet($("#cab-15")[0], [[0.2851562, 0.7340116], [0.546875, 0.7340116], [0.546875, 1], [0.2851562, 1]])
    cabs.push(cab_15);


    let cab_16 = new Cabinet($("#cab-16")[0], [[0.546875, 0.6642441], [0.734375, 0.6642441], [0.734375, 1], [0.546875, 1]])
    cabs.push(cab_16);


    let cab_1 = new Cabinet($("#cab-1")[0], [[0.2851562, 0.6642441], [0.4335937, 0.6642441], [0.4335937, 0.4869186],
    [0.5921875, 0.4869186], [0.5835937, 0.559593], [0.734375, 0.559593], [0.7265625, 0.4869186], [1, 0.4869186], [1, 0.6642441],
    [0.546875, 0.6642441], [0.546875, 0.7340116], [0.2851562, 0.7340116]])
    cabs.push(cab_1);


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
