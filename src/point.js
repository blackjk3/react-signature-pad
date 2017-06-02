export default class Point {

  constructor(x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time || new Date().getTime();
  }

  velocityFrom(start) {
    return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
  }

  distanceTo(start) {
    return Math.sqrt((this.x - start.x) ** 2) + ((this.y - start.y) ** 2);
  }

}
