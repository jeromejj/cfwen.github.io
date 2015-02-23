if (typeof (Module) == "undefined") {
    importScripts('teichmuller_map.js');
}
Module['print'] = function (x) { postMessage(x); };

onmessage = function (event) {	
    var param = event.data;   
    
    var face = param.face;
    var vertex = param.vertex;
    var landmark = param.landmark;

    // var pf = Module._malloc(nf * df * 4); // Get buffer from emscripten.
    // Get a int32 view on the newly allocated buffer.
    // var face_buffer = new Int32Array(Module.HEAP32.buffer, pf, nf * df);
    // Populate the buffer in JavaScript land.
    // console.log("buffer length = " + length + "\n");

    //for (var i = 0; i < nf; i++) {
    //    face_buffer[i + 0 * nf] = face[i].a;
    //    face_buffer[i + 1 * nf] = face[i].b;
    //    face_buffer[i + 2 * nf] = face[i].c;
    //}

    var pf = Module._malloc(nf * df * fb.BYTES_PER_ELEMENT);
    var pv = Module._malloc(nv * dv * vb.BYTES_PER_ELEMENT);
    var pl = Module._malloc(nl * dl * lb.BYTES_PER_ELEMENT);

    var pfv = Module._malloc(nv * dv * vb.BYTES_PER_ELEMENT);

    var fbHeap = new Int32Array(Module.HEAP32.buffer, pf, nf * df);
    fbHeap.set(fb);

    var vbHeap = new Float64Array(Module.HEAPF64.buffer, pv, nv * dv);
    vbHeap.set(vb);

    var lbHeap = new Float64Array(Module.HEAPF64.buffer, pl, nl * dl);
    lbHeap.set(lb);

    var call_teichmuller_map_with_boundary = Module.cwrap('_Z34call_teichmuller_map_with_boundaryPvPKviiS1_iiS1_ii', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    var stat = call_teichmuller_map_with_boundary(pfv, pf, nf, df, pv, nv, dv, pl, nl, dl);
    if (stat) {
        console.log("error occured, please check log");
    }

    Module._free(pf);
    Module._free(pv);
    Module._free(pl);
    fbHeap = null;
    vbHeap = null;
    lbHeap = null;

    var fvbHeap = new Float64Array(Module.HEAPF64.buffer, pfv, nv * dv);
    //fvbHeap.set(fvb);
    //fvb.set(fvbHeap);

    postMessage(fvbHeap, [fvbHeap.buffer]);
    Module._free(pfv);
    fvbHeap = null;
}
