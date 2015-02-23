function ModelViewer(container){
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    if (height == 0) {
        height = width;
        container.style.height = height+'px';
    }   

    this.container = container;       
    this.camera = new THREE.PerspectiveCamera(60, width/height, 0.05, 1000);    
    this.controls = new THREE.TrackballControls( this.camera, this.container );
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });    

    var _this = this;

    this.init = function(){
        _this.container.appendChild(_this.renderer.domElement);
        _this.renderer.setSize(width,height);    
        _this.renderer.setClearColor(0xffffff,1);
        
        _this.controls.rotateSpeed = 4.0;
        _this.controls.zoomSpeed = 4;
        _this.controls.panSpeed = 1
        _this.controls.staticMoving = false;
        _this.controls.dynamicDampingFactor = 0.3;
        _this.controls.keys = [ 65, 83, 68 ];
        _this.controls.addEventListener( 'change', function(){        
            _this.render();
        }, false );        
        _this.controls.addEventListener( 'resize', function(){
            _this.resize();
        }, false);
        _this.container.addEventListener('mousedown', function (event) {
            _this.mousedown(event);
        }, false);
        
        _this.animate();
        _this.render();
    };

    this.resize = function() {        
        width = _this.renderer.domElement.offsetWidth;
        height = _this.renderer.domElement.offsetHeight;
        _this.camera.aspect = width / height;
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize( width, height );
        _this.controls.handleResize();
        _this.render();
    };

    this.animate = function() {
        requestAnimationFrame( _this.animate );
        _this.controls.update();
    }

    this.render = function() {
        _this.renderer.render( _this.scene, _this.camera );
        
        // console.log('render');
        // var camera = _this.camera;
        // console.log('camera.pos: ('+ camera.position.x + ',' + camera.position.y + ',' + camera.position.z + '), ' + 'camera.up: (' + camera.up.x + ',' + camera.up.y + ',' + camera.up.z + ')');
    }
    this.mesh = [];
    this.load = function(name){        
        var loader = new THREE.PLYLoader();
        loader.addEventListener('load', function(event) {
            var geometry = event.content;
            
            var material = new THREE.MeshBasicMaterial({
                color : 0x24a9e1,
                wireframe: true,
                vertexColors: THREE.VertexColors
            });            
            geometry.computeBoundingSphere();
            
            var bs = geometry.boundingSphere;
            _this.camera.position.z = bs.radius*2;                
                                
            _this.mesh = new THREE.Mesh(geometry, material);            
            _this.scene.add(_this.mesh);        
            _this.render();
        });
        loader.load(name);
        _this.render();
    };

    this.selectionMode = false;
    this.anchor = new Array();
    this.resetAnchor = function () {
        _this.anchor = new Array();
    };
    this.mousedown = function (event) {        
        if (_this.selectionMode) {            
            var vector = new THREE.Vector3(((event.offsetX) / width) * 2 - 1, -((event.offsetY) / height) * 2 + 1, 1);
            var projector = new THREE.Projector();
            projector.unprojectVector(vector, _this.camera);
            var ray = new THREE.Raycaster(_this.camera.position, vector.sub(_this.camera.position).normalize());
            //var children = _this.scene.children;
            //var children_origin = children.slice(0);
            //for (var i = 0; i < children.length; ++i) {
            //    if (children[i] instanceof THREE.Line) {
            //        children[i] = null;
            //    }
            //}
            var object = ray.intersectObjects([_this.mesh]);
            if (object.length != 1) {
                console.log('ray intersects with more than 1 objects or no object.')
            }
            else {
                var i = object[0];
                var vertices = i.object.geometry.vertices;                
                var pi = i.point.clone();
                var v1 = new THREE.Vector3(0,0,0);
                var v2 = new THREE.Vector3(0,0,0);
                var v3 = new THREE.Vector3(0,0,0);                
                v1.subVectors(pi, vertices[i.face.a]);
                v2.subVectors(pi, vertices[i.face.b]);
                v3.subVectors(pi, vertices[i.face.c]);
                var d1 = v1.length();
                var d2 = v2.length();
                var d3 = v3.length();
                var md = d1;
                var vi = i.face.a;
                if (d2<md){
                    vi = i.face.b;
                    md = d2;
                }
                if(d3<md){
                    vi = i.face.c;
                    md = d3;
                }                
                
                var ai = {
                    vertexIndex: vi,
                    vertex: vertices[vi],
                    faceIndex: i.faceIndex,
                    face:i.face,
                    point: i.point,
                    distance: i.distance
                };
                _this.anchor.push(ai);
                
                console.log('anchor: (' + [ai.vertex.x, ai.vertex.y, ai.vertex.z] + ')');
            }
            //console.log(object);
            //if (object.length > 0) {
            //    var mx = object[0].point.x;
            //    var my = object[0].point.y;
            //    var mz = object[0].point.z;
            //    _this.anchor.push(object[0]);
            //    console.log([mx, my, mz]);
            //}
            //_this.scene.children = children_origin.slice(0);
        }
    };

    this.init();
}
