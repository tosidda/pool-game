const delta = 1/177;

function GameWorld() {
    this.balls = [
        [new Vector2(1022, 413), Colors.yellow],
        [new Vector2(1056, 393), Colors.yellow],
        [new Vector2(1056, 433), Colors.red],
        [new Vector2(1090, 374), Colors.red],
        [new Vector2(1090, 413), Colors.black],
        [new Vector2(1090, 452), Colors.yellow],
        [new Vector2(1126, 354), Colors.yellow],
        [new Vector2(1126, 393), Colors.red],
        [new Vector2(1126, 433), Colors.yellow],
        [new Vector2(1126, 472), Colors.red],
        [new Vector2(1162, 335), Colors.red],
        [new Vector2(1162, 374), Colors.red],
        [new Vector2(1162, 413), Colors.yellow],
        [new Vector2(1162, 452), Colors.red],
        [new Vector2(1162, 491), Colors.yellow],
        [new Vector2(413, 413), Colors.white]
    ].map(params => new Ball(params[0],params[1]));
    this.whiteBall = this.balls[this.balls.length - 1];
    //this.whiteBall  = new Ball(new Vector2(413, 413), Colors.white);
    this.stick = new Stick(new Vector2(413, 413), this.whiteBall.shoot.bind(this.whiteBall));
    this.table = {
        TopY: 57,
        RightX: 1443,
        BottomY: 768,
        LeftX: 57
    }
}

GameWorld.prototype.handleCollisions = function() {
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].handleBallOnPocket();
        this.balls[i].collideWithTable(this.table);
        for (let j = i + 1; j < this.balls.length; j++) {
            const firstBall = this.balls[i];
            const secondBall = this.balls[j];
            firstBall.collideWithBall(secondBall);
        }
    }
}

GameWorld.prototype.update = function() {
    this.handleCollisions();
    this.stick.update();
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].update(delta);
    }

    if (!this.ballsMoving() && this.stick.shot) {
        this.stick.reposition(this.whiteBall.position);
    }
}

GameWorld.prototype.draw = function() {
    Canvas.drawImage(sprites.background, {x: 0, y: 0},);
    this.stick.draw();
    for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].draw();
    }
}
GameWorld.prototype.ballsMoving = function() {
    let ballsMoving = false;
    for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].moving) {
            ballsMoving = true;
            break;
        }
    }
    return ballsMoving;
}