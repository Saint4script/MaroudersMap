
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


$(document).ready(() => {
    resizeCabs();
})

window.onresize = function( event ) {
    resizeCabs();
};


    /* Оставлено для потомков, если они обосруться
    let cab_10 = new Cabinet($("#cab-10")[0], [[0, 0], [0.5078125,0], [0.5078125, 0.0406976],
        [0.546875, 0.0406976], [0.546875, 0.4869186], [0,0.4869186]])
    cabs.push(cab_10);


    let cab_5 = new Cabinet($("#cab-5")[0], [[0.5078125,0], [0.790625,0], [0.790625, 0.1075581],
        [0.7148437, 0.1075581], [0.7148437, 0.3851744], [0.603125, 0.3851744], [0.5921875, 0.4869186], [0.546875, 0.4869186],
        [0.546875, 0.0406976], [0.5078125, 0.0406976]])
    cabs.push(cab_5);*/

/*
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
    cabs.push(cab_1);*/



