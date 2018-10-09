(function (top) {
    var SD = Object.create(null),
        recent,
        OBJECT = Object.create(null),
        whiteColor = 0xffffff;
    function createScene() {
        recent = OBJECT.scene = new THREE.Scene();
        return SD;
    };
    function deepSet(propname, value) {
        var deepprops = propname.split('\.');
        deepprops.reduce(function (prop, next, index) {
            if (index === deepprops.length - 1) {
                if (typeof prop === 'function') {
                    prop.apply(prop, value)
                } else {
                    SD.set(next, value, prop)
                }
            } else {
                return prop[next]
            }

        }, recent)
        return SD;
    }
    SD.copy = function (propname, callback) {
        if (typeof callback === 'function') {
            var value = callback(OBJECT);
            value !== undefined && SD.set(propname+".copy", value)
        }
        return SD;
    }
    SD.set = function (propname, value, obj) {
        if (recent === null) {
            throw new Error("所有工作都未开始，请创建相关内容")
        }
        if (propname.indexOf('\.') > -1) {
            return deepSet(propname, value)
        }
        if (obj == undefined) {
            obj = recent;
        }
        var prop = obj[propname];
        if (typeof prop === 'function') {
            if (Array.isArray(value)) {
                prop.apply(obj, value)
            } else {
                prop.call(obj, value)
            }
        } else {
            switch (propname) {
                case 'color':
                case 'background':
                    if (Number.isInteger(value)) {
                        value = new THREE.Color(value)
                    }
            }
            obj[propname] = value;
        }
        return SD;
    }
    SD.setAll = function (props) {
        Object.entries(props).forEach(function (entry) {
            SD.set.apply(null, entry)
        });
        return SD;
    }
    /**
     * 控制器
     */
    SD.useControl = {
        Trackball: function () {
            if(THREE.TrackballControls){
                recent = OBJECT.control = new THREE.TrackballControls(OBJECT.camera, OBJECT.renderer.domElement)
            }else{
                console.error("没有引入『TrackballControls.js』")
            }
            return SD;
        }
    }
    /**
     * 相机分类
     */
    SD.useCamera = {
        Perspective: function (fov, aspect, near, far) {
            recent = OBJECT.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            OBJECT.cameraIntroduce =
                "这一投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。"
            return SD
        },
    }
    /**
     * 渲染器分类
     */
    SD.useRenderer = {
        WebGL: function (parameters) {
            if (!OBJECT.renderer) {
                recent = OBJECT.renderer = new THREE.WebGLRenderer(parameters)
                recent.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(recent.domElement);
            }
            return SD;
        }
    }
    /**
     * 灯光分类
     */
    OBJECT.light = Object.create(null);
    SD.useLight = {
        Directional: function (color, intensity) {
            recent = OBJECT.light.Directional = new THREE.DirectionalLight(color, intensity);
            OBJECT.light.DirectionalIntroduce =
                `将以[${new THREE.Color(color || whiteColor)}]色彩，光线强度为${intensity || 1}沿特定方向发出平行光线, 照射到无限远，类比太阳光线`

            OBJECT.scene.add(recent)
            return SD
        },
        Ambient: function (color, intensity) {
            recent = OBJECT.light.Ambient = new THREE.AmbientLight(color, intensity);
            OBJECT.AmbientIntroduce = `将以[${color || whiteColor}]色彩，光线强度为${intensity || 1}充满当前环境，不会产生阴影`
            OBJECT.scene.add(recent);
            return SD;
        },
        Point: function (color, intensity, distance, decay) {
            recent = OBJECT.light.Point = new THREE.PointLight(color, intensity, distance, decay);
            OBJECT.PointIntroduce = `将以[${color || whiteColor}]色彩，光线强度为${intensity || 1}在场景中的特定位置创建一个光源。光线照射在各个方向上（好比一个灯泡）`
            OBJECT.scene.add(recent);
            return SD;
        }
    }
    var recentHelper;
    /**
     * 灯光helper分类
     */
    SD.openLightHelper = function () {
        var helper = recent.type + 'Helper';
        if (THREE[helper] === undefined) {
            throw Error(`操作的对象${recent.type}没有Helper`)
        }
        recentHelper = OBJECT.helper = new THREE[helper](recent, 5);
        OBJECT.scene.add(recentHelper)
        return SD;
    }
    /**
     * 相机helper分类
     */
    SD.openCameraHelper = function () {
        recentHelper = OBJECT.helper = new THREE.CameraHelper(recent);
        OBJECT.scene.add(recentHelper)
        return SD;
    }

    var geometry, material;
    var base = {
        /**
         * 二维向量
         */
        Vector2: function (x, y) {
            return new THREE.Vector2(x, y)
        },
        /**
         * 三维向量
         */
        Vector3: function (x, y, z) {
            return new THREE.Vector3(x, y, z)
        },
        /**
         * 一组三维向量
         */
        Vector3Array: function () {
            return [].slice.call(arguments)
                .map(function (array) {
                    return base.Vector3.apply(null, array)
                })
        },
        /**
         * 抗锯齿算法创建平滑曲线
         */
        CatmullRomCurve3: function () {
            return new THREE.CatmullRomCurve3(base.Vector3Array.apply(null,arguments))
        }
    }
    SD.base = base;
    /**
     * 几何
     */
    var createGeometry = {
        Box: function (width, height, depth, widthSegments, heightSegments, depthSegments) {
            recent = geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
            return SD
        },
        ExtrudeBuffer: function (shape, options) {
            if (typeof shape === 'function') {
                shape = shape(base)
            }
            var shapes = new THREE.Shape(shape);
            if (typeof options === 'function') {
                options = options(base)
            }
            recent = geometry = new THREE.ExtrudeBufferGeometry(shapes, options);
            return SD;
        }
    },
        /**
         * 材质
         */
        createMaterial = {
            MeshPhong: function (parameters) {
                recent = material = new THREE.MeshPhongMaterial(parameters);
                return SD
            },
            MeshLambert: function (parameters) {
                recent = material = new THREE.MeshLambertMaterial(parameters);
                return SD
            }
        }

    /**
     * 网格孔
     * @param {function}} callback 
     */
    SD.buildMesh = function (callback) {
        callback(createGeometry, createMaterial)
        recent = OBJECT.mesh = new THREE.Mesh(geometry, material)
        OBJECT.scene.add(OBJECT.mesh)
        return SD;
    }
    SD.render = function () {
        OBJECT.renderer.render(OBJECT.scene, OBJECT.camera)
        return SD;
    }
    var isAutoMatic = false;
    var callback;

    function automatic() {
        if (isAutoMatic) {
            if (typeof callback === 'function') {
                callback(SD);
            }
            requestAnimationFrame(automatic)
            if (OBJECT.control) {
                OBJECT.control.update();
            }
            SD.render();
        }
    }
    SD.automatic = function (call) {
        callback = call;
        if (!isAutoMatic) {
            isAutoMatic = true;
            automatic()
        }
    }
    SD.stop = function () {
        isAutoMatic = false;
    }
    top.startAtScene = createScene
})(this)