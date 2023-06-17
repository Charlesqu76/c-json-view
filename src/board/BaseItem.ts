type TProps = {
  ctx: any;
  x: number;
  y: number;
};

type TPoint = {
  x: number;
  y: number;
};

class BaseItem {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  color: any;
  isDrag: boolean;
  startDragPoint: null | TPoint;
  oldPoint: TPoint;
  x: number;
  y: number;
  mid: TPoint;
  leftMid: TPoint;
  rightMid: TPoint;
  topMid: TPoint;
  botomMid: TPoint;
  constructor(ctx, props: TProps) {
    this.ctx = ctx;
    this.x = props.x;
    this.y = props.y;
  }
  // 子类实现
  draw = (): void => {
    throw new Error("子类实现");
  };

  isIn = (x, y): boolean => {
    throw new Error("子类实现");
  };

  click = (x: number, y: number): void => {};

  startDrag = (startDragPoint) => {
    this.isDrag = true;
    this.startDragPoint = startDragPoint;
  };

  endDrag = () => {
    this.isDrag = false;
    this.oldPoint = {
      x: this.x,
      y: this.y,
    };
    this.startDragPoint = null;
  };

  calculatePoints = (x, y) => {
    this.x = x;
    this.y = y;
    this.mid = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    this.leftMid = { x: this.x, y: this.y + this.height / 2 };
    this.rightMid = { x: this.x + this.width, y: this.y + this.height / 2 };
    this.topMid = { x: this.x + this.width / 2, y: this.y };
    this.botomMid = { x: this.x + this.width / 2, y: this.y + this.height };
  };

  move = (mouseX, mouseY) => {
    if (!this.isDrag) return;
    const { x = 0, y = 0 } = this.startDragPoint || {};
    const offsetX = mouseX - x;
    const offsetY = mouseY - y;
    this.calculatePoints(this.oldPoint.x + offsetX, this.oldPoint.y + offsetY);
  };
}

export default BaseItem;
