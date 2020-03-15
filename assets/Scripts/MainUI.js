
cc.Class({
    extends: cc.Component,

    //绘制界面
    properties: {
        graphics: cc.Prefab,

        leftBian: cc.PhysicsBoxCollider,
        rightBian: cc.PhysicsBoxCollider,
        downBian: cc.PhysicsBoxCollider,
    },



    onLoad() {
        window.mainUi = this;


        //开启物理
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;

        //绘制物理信息
        manager.debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;

        //注册
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
    },

    start() {

        this.downBian.node.position = cc.Vec2(0, -cc.winSize.height / 2);
        this.downBian.editing = true;
        this.downBian.size = cc.Size(cc.winSize.width,10);

        this.leftBian.node.position = cc.Vec2(-cc.winSize.width / 2 + this.leftBian.size.width, 0);

        this.rightBian.node.position = cc.Vec2(cc.winSize.width / 2 - this.rightBian.size.width, 0);

         //先准备好一个绘制界面
         this.createGraphics();
    },
    touch_start: function (event) {
    },
    touch_move: function (event) {
    },
    touch_end: function (event) {

        //每次画完在准备好一个绘制界面
        this.createGraphics();
    },
    createGraphics() {
        var graphics_node = cc.instantiate(this.graphics);
        console.log("~~~~~~~~~~~~~~",graphics_node);
        graphics_node.x = 0;
        this.node.addChild(graphics_node);
    },
    update(dt) { },
});
