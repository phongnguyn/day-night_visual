export function borderCheck(x, y, r, width, height) {
    let vx = 1, vy = 1;
    if (x < 0 || x + 2*r > width) vx =- 1;
    if (y < 0 || y + 2*r > height) vy =- 1;
    return [vx, vy];
}

export function circleRect(cx, cy, radius, rx, ry, rw, rh, vx, vy) {
    // temporary variables to set edges for testing
    let testX = cx;
    let testY = cy;
  
    // which edge is closest?
    if (cx < rx)         {testX = rx;}      // test left edge
    else if (cx > rx+rw) {testX = rx+rw;}   // right edge
    if (cy < ry)         {testY = ry;}     // top edge
    else if (cy > ry+rh) {testY = ry+rh;}   // bottom edge
  
    // get distance from closest edges
    let distX = cx-testX;
    let distY = cy-testY;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the radius, collision!
    if (distance > radius) {
      return [vx,vy, false];
    }
    if (distance === 0) return [vx * -1,vy * -1, true];
    let c = 2 * (vx * distX + vy * distY) / ((distX*distX) + (distY*distY));
    vx = vx - c * distX;
    vy = vy - c * distY;
    return [vx,vy, true];
}