# SD
chain of THREE.JS grammar

目前还未完成所有的内容，仅提供部分基础操作

SD的核心就是链式语法，使用链式语法操作THREE对象。操作核心就是 `SD` 对象上提供的所有操作函数，返回SD，达成链式效果。而存储所有操作的临时对象为`recent`，存储所有对象的存储对象为`OBJECT`且OBJECT不可见

`startAtScene()` 是所有的操作开始，实际上将会调用 `new THREE.Scene()`

## 1. 赋值操作 
赋值操作的核心是`recent`对象，所有SD上的函数操作都会修改recent，从而在赋值时，直接修改recent

`SD.set()`  单次赋值，提供两种修改recent方式
```js
// var scene = new THREE.Scene()
var sd = startAtScene()
    /*  直接设置属性值
    等价于
    scene.background = new THREE.Color(0x222222)
    */
    .set('background',0x222222) // color和 background 不需要调用new THREE.Color
    /*
    调用对象函数，数组传递函数参数列表
    等价于
    scene.add( new THREE.WebGLRenderer() )
    */
    .set('add',[  new THREE.WebGLRenderer() ])
```
`SD.setAll()`  一次性赋值多个属性，采用object对象对多个操作赋值

```js
sd.setAll({
    background:0x222222,
    add:[ new THREE.WebGlRenderer() ]
})
```

`SD.copy()` 属性复制,需要提供一个回调函数，传递OBJECT对象，凡是存在copy函数的recent都可以调用copy函数赋值已经有的值

```js
sd.copy('position',function(OBJECT){
  return OBJECT.demo.position
})
// 等价操作

scene.position.copy(SomeObject.position)
```

# 2. `SD.use*` 
* `useCamera` 相机
* `useRenderer` 渲染器
* `useLight` 灯光
* `useControl` 控制器

## `SD.useCamera`
* `.Perspective()` 

等价于 `new THREE.PerspectiveCamera()`,传递相同的参数列表，挂载OBJECT对象上的字段为`camera`，`OBJECT.cameraIntroduce`提供相机说明

## `SD.useRenderer` 
* `.WebGL()` 目前内置直接安插到body中去，使用window的size作为canvas的size

## `SD.useLight`

* `.Directional()`  定向光
* `.Ambient()` 环境光
* `.Point()` 点光

## `SD.useControl`
* `.Trackball()` 轨迹球控制器

# `SD.open*Helper`
* `openLightHelper()`  打开光照辅助效果
* `openCameraHelper()` 打开相机辅助效果

