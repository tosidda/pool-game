const BALL_ORIGIN = new Vector2(25, 25);
const BALL_DIAMETER = 38;
const BALL_RADIUS = BALL_DIAMETER / 2;

function Ball(position, color) {
    this.position = position;
    this.velocity = new Vector2();
    this.moving = false;
    this.sprite = getBallSpriteByColor(color);
    this.color = color;
    this.visible = true;
}

Ball.prototype.update = function(delta) {
    if (!this.visible) {
        return;
    }

    this.position.addTo(this.velocity.mult(delta));
    this.velocity = this.velocity.mult(0.984);
    if (this.velocity.length() < 5) {
        this.velocity = new Vector2();
        this.moving = false;
    }
}

Ball.prototype.draw = function() {
    if (!this.visible) {
        return;
    }

    Canvas.drawImage(this.sprite, this.position, BALL_ORIGIN);
}

Ball.prototype.shoot = function(power, rotation) {
    this.velocity = new Vector2(power * Math.cos(rotation), power * Math.sin(rotation));
    this.moving = true;
}

Ball.prototype.collideWithBall = function(ball) {
    if (!this.visible || !ball.visible) {
        return;
    }

     // find a normal vector
     const n = this.position.subtract(ball.position);
     // find distance
     const dist = n.length();
 
     if (dist > BALL_DIAMETER) {
         return;
     }
 
     // find min dist
     const mtd = n.mult((BALL_DIAMETER - dist) / dist);
 
     // push pull balls
     this.position = this.position.add(mtd.mult(1/2));
     ball.position = ball.position.subtract(mtd.mult(1/2));
 
     // find unit normal vector
     const un = n.mult(1/n.length());
     // find unit tangent vector
     const ut = new Vector2(-un.y, un.x)
     // lots of variables for the dot calcus
     const v1n = un.dot(this.velocity);
     const v1t = ut.dot(this.velocity);
     const v2n = un.dot(ball.velocity);
     const v2t = ut.dot(ball.velocity);
     // lot's of tags boy!
     let v1nTag = v2n;
     let v2nTag = v1n;
     // vector transfomration
     v1nTag = un.mult(v1nTag);
     const v1tTag = ut.mult(v1t);
     v2nTag = un.mult(v2nTag)
     const v2tTag = ut.mult(v2t);
     // update boy!
     this.velocity = v1nTag.add(v1tTag);
     ball.velocity = v2nTag.add(v2tTag);
     
     this.moving = true;
     ball.moving = true;
}

Ball.prototype.handleBallOnPocket = function() {
    if (!this.visible) {
        return;
    }

    let inPocket = Constants.pockets.some(pocket => {
        console.log(this.position.distFrom(pocket) +" " +Constants.pocketRadius);
        return this.position.distFrom(pocket) < Constants.pocketRadius;
    })
    console.log("inPocket :" +inPocket);
    if(!inPocket) {
        console.log("poop");
        return;
    }

    this.moving = false;
    this.visible = false;

} 

Ball.prototype.collideWithTable = function(table) {
    if (!this.moving || !this.visible) {
        return;
    }
    let collided = false;
    if (this.position.y <= table.TopY + BALL_RADIUS) {
        this.position.y = table.TopY + BALL_RADIUS;
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if (this.position.x >= table.RightX - BALL_RADIUS) {
        this.position.x = table.RightX - BALL_RADIUS;
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if (this.position.y >= table.BottomY - BALL_RADIUS) {
        this.position.y = table.BottomY - BALL_RADIUS;
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if (this.position.x <= table.LeftX + BALL_RADIUS) {
        this.position.x = table.LeftX + BALL_RADIUS;
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(collided) {
        this.velocity = this.velocity.mult(0.98);
    }
}


