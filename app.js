class Bus {
  constructor() {
    this.draw = this.draw.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.chooseNewDestination = this.chooseNewDestination.bind(this);

    this.backgroundImage = backgroundImage;
    this.busSpritesheet = busSpritesheet;
    this.bus;

    this.lastAnimatedTimestamp = 0;

    this.x = 0;
    this.y = 0;

    var canvas = document.getElementById("mapCanvas");
    this.chooseNewDestination();

    this.animationFrame = 0;

    this.animationFrameWidth = 500;
    this.animationFrameHeight = 500;

    this.animationFrameCount = 4;
    this.animationFrameSpeed = 8; // fps

    this.rightAnimationRow = 0;
    this.leftAnimationRow = 1;
    this.downAnimationRow = 2;
  }

  draw(timestamp) {
    if (
      timestamp - this.lastAnimatedTimestamp >
      1000 / this.animationFrameSpeed
    ) {
      this.animationFrame++;

      if (this.animationFrame === this.animationFrameCount) {
        this.animationFrame = 0;
      }
      this.lastAnimatedTimestamp = timestamp;
    }

    var canvas = document.getElementById("mapCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.backgroundImage, 0, 0);

    ctx.drawImage(
      this.busSpritesheet,
      this.animationFrame * this.animationFrameWidth,
      this.rightAnimationRow * this.animationFrameHeight,
      this.animationFrameWidth,
      this.animationFrameHeight,
      this.x,
      this.y,
      200,
      200
    );

    this.updatePosition();
    window.requestAnimationFrame(this.draw);
  }

  updatePosition() {
    console.log("position: ", this.x, this.y, "Destionation", this.destination);
    const distance =
      (this.destination.x - this.x) ^
      (2 + (this.destination.y - this.y)) ^
      2 ^
      0.5;

    if (distance < 20) {
      return this.chooseNewDestination();
    }

    const vectorToDestination = {
      x: (this.destination.x - this.x) / distance,
      y: (this.destination.y - this.y) / distance,
    };

    const angleToDestination = Math.acos(
      (this.destination.y - this.y) / distance
    );

    if (angleToDestination) this.x += vectorToDestination.x;
    this.y += vectorToDestination.y;
  }

  chooseNewDestination() {
    var canvas = document.getElementById("mapCanvas");
    this.destination = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    };
  }
}

class ImageLoader {
  constructor(imagesToLoad) {
    this._imagesToLoad = imagesToLoad;
    this._imagesLoaded = 0;
    this.registerImageLoaded = this.registerImageLoaded.bind(this);
    this.onFinished = this.onFinished.bind(this);
  }

  registerImageLoaded() {
    this._imagesLoaded++;
    console.log("new total count: ", this._imagesLoaded);
    if (this._imagesLoaded === this._imagesToLoad) {
      this.onFinished();
    }
  }
  onFinished() {
    window.requestAnimationFrame((timestamp) => {
      new Bus().draw(timestamp);
    });
  }
}

const loader = new ImageLoader(2);

const backgroundImage = new Image();
backgroundImage.src =
  "https://images.photowall.com/products/43526/mannerstal-world-map.jpg?h=699&q=85";
backgroundImage.onload = loader.registerImageLoaded;

const busSpritesheet = new Image();
busSpritesheet.src = "/van-sheet.png";
busSpritesheet.onload = loader.registerImageLoaded;
