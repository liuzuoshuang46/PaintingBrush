cc.Class({
    extends: cc.Component,

    properties: {
        linePrefab: cc.Prefab,
        linePhysicsPrefab: cc.Prefab,
    },

    onLoad: function () {
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.debugDrawFlags = 0;

        cc.director.getPhysicsManager().debugDrawFlags = 
            cc.PhysicsManager.DrawBits.e_jointBit 
            // cc.PhysicsManager.DrawBits.e_shapeBit
            ;
    },

    start: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndCallback, this);
    },

    onTouchStartCallback: function (event) {
        console.log("touch start ... ");
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.recordPos = cc.v2(pos.x, pos.y);
        this.preDistance = null;
        this.node.getChildByName("lineParent").removeAllChildren();
        
      
    },

    onTouchMoveCallback: function (event) {
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        
        // 记录当前手移动到的点
        this.currentPos = cc.v2(pos.x, pos.y);
        //求两点之间的距离
        let subVec = this.currentPos.subSelf(this.recordPos);
        let distance = subVec.mag();
        // 如果距离大于一定值，这里的25是预制体的width
        // cc.log("distance"+distance);
        
        if (distance >= 5) {
            // 给定方向向量
            let tempVec = cc.v2(0, 10);
            // 求两点的方向角度
            let rotateVec = subVec.signAngle(tempVec) / Math.PI * 180 -90;



           
            // 创建预制体 
            let lineItem = cc.instantiate(this.linePrefab);
            lineItem.parent = this.node.getChildByName("lineParent");
            lineItem.width = distance;
            lineItem.height = 5;
            lineItem.setPosition((pos.x + this.recordPos.x)/2, (pos.y + this.recordPos.y)/2);
            lineItem.rotation = rotateVec;
            // console.log("angle",rotateVec);
            //画线
            let linePhysics = lineItem.getChildByName("Line").getComponent(cc.Graphics);
            //linePhysics.moveTo(this.recordPos.x - pos.x,this.recordPos.y - pos.y);
            // linePhysics.node.rotation = rotateVec;
            linePhysics.moveTo(-distance/2,0);
            linePhysics.lineTo(distance/2, 0);
            linePhysics.stroke();

            
            //设置碰撞体
            let phy = lineItem.getComponent(cc.PhysicsBoxCollider);
            phy.offset = cc.v2(0,0);
            phy.size.width = distance;
            phy.size.height = 5;
            phy.apply();

            //焊接
            lineItem.addComponent(cc.WeldJoint);
            let weld = lineItem.getComponent(cc.WeldJoint);
            if( this.preDistance != null)
            {
                // let arrowBody = lineItem.getChildByName("Line1").getComponent(cc.RigidBody);
                let targetBody = this.preDistance.getComponent(cc.RigidBody);


                weld.connectedBody = targetBody;
                // // let pos1 = cc.v2(this.preDistance.x - lineItem.x, this.preDistance.y - lineItem.y)
                // // let pos2 = cc.v2(0,0)
                // var rot = -1*(this.prorotate - rotateVec) +90;
                // // console.log("angle",rot);
                // var angle = 0;
                
                // angle = ((rot) * Math.PI) / 180;

                // let yValue = Math.cos(angle) * distance/2;
                // let xValue = Math.sin(angle) * distance/2;
                weld.anchor = cc.v2( -this.preDistance.width/2  ,0);
                weld.connectedAnchor = cc.v2( distance/2  ,0);
                weld.referenceAngle = (this.prorotate) - (rotateVec );
                // console.log("!!!!!!!!!!!!!!",weld.anchor);
                // console.log("!!!!!!!!!!!!!!",weld.connectedAnchor);
                // console.log("!!!!!!!!!!!!!!",weld.referenceAngle);
                console.log("!!!!!!!!!!!!!!",this.prorotate);
                console.log("!!!!!!!!!!!!!!",rotateVec);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

               
                // // weld.anchor = cc.v2( this.preDistance.x - lineItem.x , this.preDistance.y - lineItem.y);
                // weld.apply();
            }
            this.preDistance = lineItem;
            this.prorotate = rotateVec;

            // .offset.x = -lineItem.width / 2
            // lineItem.getComponent(cc.PhysicsBoxCollider).size.width = lineItem.width;
            // lineItem.getComponent(cc.PhysicsBoxCollider).size.height = 5;
            // lineItem.getComponent(cc.PhysicsBoxCollider).apply();

           
            // 这一步是为了防止两个线段之间出现空隙，动态改变预制体的长度
            // lineItem.setPosition(pos.x, pos.y);
            // lineItem.width = distance;

             
            
            

            // lineItem.getComponent(cc.PhysicsBoxCollider).offset.x = -lineItem.width / 2
            // lineItem.getComponent(cc.PhysicsBoxCollider).size.width = lineItem.width;
            // lineItem.getComponent(cc.PhysicsBoxCollider).size.height = 5;
            // lineItem.getComponent(cc.PhysicsBoxCollider).apply();

            // lineItem.active = false;
            // if( this.preDistance != null)
            // {
            //     lineItem.getChildByNme("last").getComponent(cc.WeldJoint).connectedBody = this.preDistance.getChildByNme("next").getComponent(cc.RigidBody);
            //     // lineItem.getChildByNme("last").x = -lineItem.width/2;
            //     // lineItem.getChildByNme("next").x = lineItem.width/2;
            //     // lineItem.getComponent(cc.WeldJoint).anchor = cc.v2(this.preDistance.x - lineItem.x,this.preDistance.y - lineItem.y);
            //     // lineItem.getComponent(cc.DistanceJoint).apply();
            // }
            // this.preDistance = lineItem;
           

            


            // 将此时的触摸点设为记录点
            this.recordPos = cc.v2(pos.x, pos.y);
        }
    },

    onTouchEndCallback: function (event) {
        console.log("touch end ... ");

        // //重置节点的重力
        // this.linePhysics.node.addComponent(cc.RigidBody);

        //所有子节点显示并且激活刚体
        let child = this.node.getChildByName("lineParent").children;
        for(let i =0;i<child.length;i++) 
        {
            let data = child[i];
            // data.rotation = 0;
            let rig = data.getComponent(cc.RigidBody);
            rig.type = cc.RigidBodyType.Dynamic;

        }

        this.preDistance = null;


        // let weld = lineItem.getComponent(cc.WeldJoint);
        // if( this.preDistance != null)
        // {
        //     let arrowBody = lineItem.getComponent(cc.RigidBody);
        //     let targetBody = this.preDistance.getComponent(cc.RigidBody);

        //     weld.connectedBody = targetBody;
        //     weld.anchor = cc.v2( this.preDistance.x - lineItem.x , this.preDistance.y - lineItem.y);
        //     weld.apply();
        // }
        // this.preDistance = lineItem;

        // this.scheduleOnce(function()
        // {
        //     this.preDistance = null
        //     for(let i =0;i<child.length;i++) 
        //     {
        //         let data = child[i];
        //         data.addComponent(cc.WeldJoint);
        //         let weld = data.getComponent(cc.WeldJoint);
        //         if( this.preDistance != null)
        //         {
        //             let pos1 = this.preDistance.getPosition();
        //             let pos2 = data.getPosition();
        //             weld.connectedBody = this.preDistance.getComponent(cc.RigidBody);


        //             var rot = data.rotation ;
        //             var angle = 0;
        //             if(rot > 0) {
        //                 angle = (Math.PI / 180) * rot;
        //             }
        //             else
        //             {
        //                 angle = (Math.PI / 180) * (360 + rot);
        //             }
        //             this.yValue = Math.cos(angle) * this.speed;
        //             this.xValue = Math.sin(angle) * this.speed;

                    

        //             weld.anchor = cc.v2(pos1.x - pos2.x,pos1.y - pos2.y);
        //             // weld.referenceAngle = (data.angle - this.preDistance.angle);
        //             weld.apply();
        //             // weld.anchor = cc.v2(-distance/2,0);
        //             // weld.apply();getWorldCenter
        //         }
        //         this.preDistance = data;
        //     }

        // },0.1);
        
    },

    createlinePhysics()
    {
        let linePhysicsNode = cc.instantiate(this.linePhysicsPrefab);
        linePhysicsNode.parent = this.node;
        this.linePhysics = linePhysicsNode.getComponent(cc.Graphics);
        // this.linePhysics: cc.Graphics
    },
    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this);
    }
});