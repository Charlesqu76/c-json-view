import BaseItem from "./BaseItem";
import Item from "./Item";
import TextItem from "./TextItem";

const componentMap = { item: Item, textItem: TextItem };

class Board {
  items: Array<BaseItem>;
  context: HTMLCanvasElement;
  connects: Array<[BaseItem, BaseItem]>;
  ctx: CanvasRenderingContext2D;
  isTexting: boolean;
  constructor(id) {
    if (!id) throw new Error("need id");
    this.context = document.getElementById(id) as HTMLCanvasElement;
    if (!this.context) throw new Error("need canvas element");
    this.ctx = this.context.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) throw new Error(" can not get ctx");
    this.context.addEventListener("mousemove", this.handleMouseMove);
    this.context.addEventListener("mousedown", this.handleMouseDown);
    this.context.addEventListener("mouseup", this.handleMouseUp);
    this.items = [];
    this.connects = [];
    this.isTexting = false;
  }

  // 画布添加元素
  addItem = (data: {
    name: string;
    type: keyof typeof componentMap;
    props: {};
  }) => {
    const { name, props, type } = data;
    const item = new componentMap[type](this.ctx, props);
    this.items.push(item);
    item?.draw();
  };

  // 链接两个元素
  connect = (item1: BaseItem, item2: BaseItem) => {
    if (!item1 || !item2) return;
    this.connects.push([item1, item2]);
    this.drawConnectLine(item1, item2);
  };

  // 计算item2相对于item1位置
  // L R T B
  calculatePosition = (item1: BaseItem, item2: BaseItem) => {
    const {
      mid: m1,
      topMid: tm1,
      botomMid: bm1,
      leftMid: lm1,
      rightMid: rm1,
    } = item1;
    const {
      mid: m2,
      topMid: tm2,
      botomMid: bm2,
      leftMid: lm2,
      rightMid: rm2,
    } = item2;
    if (lm2.x > rm1.x) {
      return "R";
    }
    if (rm2.x < lm1.x) {
      return "L";
    }
    if (bm2.y > tm1.y) {
      return "T";
    }
    if (tm2.y < bm1.y) {
      return "B";
    }
  };

  // 鼠标移动
  handleMouseMove = (e: MouseEvent) => {
    const { offsetX, offsetY } = e || {};
    this.items.forEach((item) => {
      if (item.isDrag) {
        item.move(offsetX, offsetY);
        this.update();
      }
    });
  };

  // 鼠标按下
  handleMouseDown = (e: MouseEvent) => {
    const { x, y } = e;
    this.items.forEach((item) => {
      if (item instanceof TextItem) {
        item.click(x, y);
      } else {
        const { offsetX, offsetY } = e || {};
        if (item.isIn(offsetX, offsetY)) {
          const { offsetX, offsetY } = e || {};
          item.startDrag({ x: offsetX, y: offsetY });
        }
      }
    });
  };

  clickText = (item: BaseItem) => {
    if (this.isTexting) {
      this.isTexting = false;
      const textBox = document.getElementById("textBox") as HTMLTextAreaElement;
      textBox.style["z-index"] = 1;
      // @ts-ignore
      item.changeText(textBox.value);
      this.update();
    } else {
      this.isTexting = true;
      // @ts-ignore
      const { x, y, style, text } = item;
      const { fontSize } = style;
      const textBox = document.getElementById("textBox") as HTMLTextAreaElement;
      textBox.value = text;
      textBox.style["z-index"] = 6;
      textBox.style["top"] = `${y}px`;
      textBox.style["left"] = `${x}px`;
      textBox.style["fontSize"] = fontSize;
      textBox.focus();
    }
  };

  // 鼠标松开
  handleMouseUp = (e: MouseEvent) => {
    this.items.forEach((item) => {
      item.endDrag();
    });
  };

  drawConnectLine = (item1: BaseItem, item2: BaseItem) => {
    const {
      mid: m1,
      topMid: tm1,
      botomMid: bm1,
      leftMid: lm1,
      rightMid: rm1,
    } = item1;
    const {
      mid: m2,
      topMid: tm2,
      botomMid: bm2,
      leftMid: lm2,
      rightMid: rm2,
    } = item2;
    let points = [] as Array<{ x: number; y: number }>;
    const position = this.calculatePosition(item1, item2);
    const calP = (m1, m2, horizon): Array<{ x: number; y: number }> => {
      if (horizon) {
        return [
          m1,
          { x: (m1.x + m2.x) / 2, y: m1.y },
          {
            x: (m1.x + m2.x) / 2,
            y: m2.y,
          },
          m2,
        ];
      } else {
        return [
          m1,
          { x: m1.x, y: (m1.y + m2.y) / 2 },
          {
            x: m2.x,
            y: (m1.y + m2.y) / 2,
          },
          m2,
        ];
      }
    };
    switch (position) {
      case "T": {
        points = calP(bm1, tm2, false);
        break;
      }
      case "B": {
        points = calP(tm1, bm2, false);
        break;
      }
      case "L": {
        points = calP(lm1, rm2, true);
        break;
      }
      case "R": {
        points = calP(rm1, lm2, true);
        break;
      }
      default: {
        points = calP(m1, m2, true);
      }
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    points.forEach((point, i) => {
      if (!i) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.stroke();
    this.ctx.closePath();
  };

  update = () => {
    this.ctx.clearRect(0, 0, 800, 800);
    this.items.forEach((item) => {
      item.draw();
    });
    this.connects.forEach((connect) =>
      this.drawConnectLine(connect[0], connect[1])
    );
  };

  drawTextWithContainer = () => {};
}

export default Board;
