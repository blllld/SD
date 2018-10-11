var sas = startAtScene()
    .useCamera.Perspective(45, window.innerWidth / window.innerHeight, 1, 1e3)
    .setAll({
        'position.set': [-200, 50, 0],
        'lookAt': [new THREE.Vector3(0, 0, 0)]
    })
    .useRenderer.WebGL()
    .setAll({
        'shadowMap.enabled': true,
        'shadowMapSoft': true,
        'setClearColor': [0xffffff, 0]
    })
    .useControl.Trackball()
    .fn('initPlanet', function (name, speed, angle, color, distance, volume) {
        this.buildMeshGroup(name, function () {
            this.group()
                // 星球
                .buildMesh(function (createGeometry, createMaterial) {
                    createGeometry.Sphere(volume, 20, 20)
                    createMaterial.MeshLambert({ emissive: color });
                    return { name: name, speed: speed, angle: angle, distance: distance, volume: volume, }
                })
                .setAll({ 'name': name, 'position.z': -distance, 'receiveShadow': true, 'castShadow': true })
                // 星环
                .buildMesh(function (createGeometry, createMaterial) {
                    createGeometry.Ring(distance - 0.2, distance + 0.2, 64, 1)
                    createMaterial.MeshBasic({
                        color: 0x888888,
                        side: THREE.DoubleSide
                    })
                })
                .set('rotation.x', - Math.PI / 2)
                .done()
        })
    })
    .buildMeshGroup('planets', function (name) {
        this.group()
            .initPlanet('Mercury', 2e-2, 0, 'rgb(124,131,203)', 20, 2)
            .initPlanet('Venus', 0.05, 2, 'rgb(190,138,44)', 30, 4)
            .initPlanet('Earth', 0.01, 20, 'rgb(46,69,119)', 40, 5)
            .initPlanet('Mars', 0.012, 100, 'rgb(210,81,16)', 50, 4)
            .initPlanet('Jupiter', 0.03, 0, 'rgb(254,208,101)', 70, 9)
            .initPlanet('Saturn', 0.06, 0, 'rgb(210,140,39)', 100, 7)
            .initPlanet('Uranus', 0.02, 0, 'rgb(49,168,218)', 120, 4)
            .initPlanet('Neptune', 0.02, 0, 'rgb(84,125,204)', 140, 3)
            .done()
    })
    .buildMesh(function (createGeometry, createMaterial) {
        createGeometry.Sphere(12, 16, 16)
        createMaterial.MeshLambert({
            color: 0xffff00,
            emissive: 0xdd4422
        })
    })

function moveEachStar(star) {
    star.angle += star.speed;
    if (star.angle > Math.PI * 2) {
        star.angle -= Math.PI * 2;
    }
    star.Mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));
}

sas.automatic(function (SD, OBJECT) {
    var planets = OBJECT.Meshes.planets;
    //planets.forEach(moveEachStar)
})