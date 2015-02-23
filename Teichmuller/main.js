var worker;
function teichmuller_map(source, target) {
    console.log('teichmuller map');
    var face0 = source.mesh.geometry.faces;
    var face = new Array(face0.length);
    for (var i = 0; i < face0.length; ++i) {
        face[i] = [face0[i].a, face0[i].b, face0[i].c];
    }
    var vertex0 = source.mesh.geometry.vertices;
    var vertex = new Array(vertex0.length);
    for (var i = 0; i < vertex0.length; ++i) {
        vertex[i] = [vertex0[i].x, vertex0[i].y];
    }

    var landmark = [[122, -1.9439855e-01, 1.0103591e-02], [17, -8.1385624e-02, 1.8355125e-02], [147, -1.5479896e-01, -1.8604319e-02]];


    if (typeof (Worker) !== "undefined") {
        if (typeof (worker) == "undefined") {
            worker = new Worker("Teichmuller/teichmuller_worker.js");
        }
        worker.onmessage = function log(event) {
            switch (typeof event.data) {
                case "object":
                    result = event.data;
                default:
                    console.log(event.data);
            }
        };
        var param = {
            face: face,
            vertex: vertex,
            landmark: landmark,
        };
        worker.postMessage(param);
    } else {
        console.log("Sorry! No Web Worker support.");
    };

    //if (stat) {
    //    console.log("error occured, please check log");
    //}
    // var fv = new Array();
    // for (var i = 0; i < 10; ++i) {
    //     fv[i] = [fv_buffer[i], fv_buffer[i + nv]];
    //     console.log(fv[i]);
    // }
    //console.log(fv);
}
