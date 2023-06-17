import BaseItem from "./BaseItem";
type TPoint = {
  x: number;
  y: number;
};

class Item extends BaseItem {
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
  constructor(ctx, props) {
    super(ctx, props);
    if (!ctx) throw new Error("ctx is required");
    this.ctx = ctx;

    this.width = props.width;
    this.height = props.height;
    this.calculatePoints(props.x, props.y);
    this.color = props.color || "red";
    this.isDrag = false;
    this.startDragPoint = null;
    this.oldPoint = {
      x: this.x,
      y: this.y,
    };
  }

  calculatePoints = (x, y) => {
    this.x = x;
    this.y = y;
    this.mid = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    this.leftMid = { x: this.x, y: this.y + this.height / 2 };
    this.rightMid = { x: this.x + this.width, y: this.y + this.height / 2 };
    this.topMid = { x: this.x + this.width / 2, y: this.y };
    this.botomMid = { x: this.x + this.width / 2, y: this.y + this.height };
  };

  draw = () => {
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = this.color;
  };

  isIn = (x, y) => {
    if (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    ) {
      return true;
    }
    return false;
  };

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

  move = (mouseX, mouseY) => {
    if (!this.isDrag) return;
    const { x = 0, y = 0 } = this.startDragPoint || {};
    const offsetX = mouseX - x;
    const offsetY = mouseY - y;
    this.calculatePoints(this.oldPoint.x + offsetX, this.oldPoint.y + offsetY);
  };
}

export default Item;
