import BaseItem from "./BaseItem";
import Item from "./Item";

type TProps = {
  text: string | number;
  style?: {
    fontSize: string;
    fontFamily: string;
  };
  withContainer: boolean;
};

export default class TextItem extends BaseItem {
  text: string;
  withContainer = true;
  width: number;
  item: Item;
  style: { fontSize: "18px"; fontFamily: "orbitron" };
  isTexting: boolean;
  textList = [] as Array<{ text: string; x: number }>;
  actualBoundingBoxAscent: number;
  actualBoundingBoxDescent: number;
  fontBoundingBoxAscent: number;
  fontBoundingBoxDescent: number;
  border = {} as { x: number; y: number; width: number; height: number };

  constructor(ctx, props) {
    super(ctx, props);
    this.text = String(props.text);
    this.style = { ...props.style, ...this.style };
    this.calculatePoints();
  }

  calculatePoints = () => {
    let acc = 0;

    const {
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
      width,
    } = this.ctx.measureText(this.text);
    this.actualBoundingBoxAscent = actualBoundingBoxAscent;
    this.actualBoundingBoxDescent = actualBoundingBoxDescent;
    this.fontBoundingBoxAscent = fontBoundingBoxAscent;
    this.fontBoundingBoxDescent = fontBoundingBoxDescent;
    this.width = width;
    this.height =
      this.actualBoundingBoxDescent +
      this.fontBoundingBoxDescent +
      this.fontBoundingBoxAscent +
      this.actualBoundingBoxAscent;

    Array.from(this.text).forEach((v) => {
      const { width, actualBoundingBoxLeft, actualBoundingBoxRight } =
        this.ctx.measureText(v);
      console.log(this.ctx.measureText(v));
      this.textList.push({ text: v, x: this.x + acc });
      acc += width + actualBoundingBoxLeft + actualBoundingBoxRight;
    });

    this.border = {
      x: this.x - 5,
      y: this.y - this.height,
      width: this.width + 30,
      height: this.height + 10,
    };
  };

  click = (x: number, y: number) => {
    const textBox = document.getElementById("textBox") as HTMLTextAreaElement;
    const isin = this.isIn(x, y);
    if (isin) {
      textBox.value = this.textList.map((v) => v.text).join("");
      textBox.style["z-index"] = 6;
      textBox.style["top"] = `${this.border.x}px`;
      textBox.style["left"] = `${this.border.y}px`;
      textBox.style["fontSize"] = this.style.fontSize;
      textBox.focus();
      this.isTexting = true;
    } else {
      textBox.style["z-index"] = 1;
      this.changeText(textBox.value);
      this.isTexting = false;
    }
  };

  isIn = (x, y) => {
    this.ctx.beginPath();
    const { x: bx, y: by, width, height } = this.border;
    this.ctx.roundRect(bx, by, width, height);
    return this.ctx.isPointInPath(x, y);
  };

  draw = () => {
    if (this.withContainer) {
      this.drawBorder();
    }
    const { fontSize, fontFamily } = this.style;
    this.ctx.font = `${fontSize} ${fontFamily}`;
    this.textList.forEach((v) => {
      const { text, x } = v;
      this.ctx.fillText(text, x, this.y);
    });
  };

  drawBorder = () => {
    this.ctx.beginPath();
    const { x, y, width, height } = this.border;
    this.ctx.roundRect(x, y, width, height);
    this.ctx.stroke();
    this.ctx.closePath();
  };

  changeText = (text) => {
    this.text = text;
  };
}
