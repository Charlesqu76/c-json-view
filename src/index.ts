import Board from "./board/index";

const json = {
  switch: false,
  level: "INFO",
  respLogLevel: "LOG_EXCEPTION",
  longTimeRespLog: 3000,
  sampleRatio: 1,
  kafkaLogConfig: {
    topic: "xxxxx",
    switch: true,
  },
  localConfig: {
    alertThreshold: "10G",
    discardThreshold: "11G",
    switch: true,
  },
  classLogConfigs: [
    {
      switch: true,
      methodLogConfigs: [
        {
          switch: true,
        },
      ],
    },
  ],
  firstName: "Jun",
  lastName: "Liu",
  age: 80,
  bio: "知道的越多、就知道的越少",
  password: "My.Pass",
  telephone: "1881446xxxx",
};

const calculateJsonItemPosition = (json) => {
  const mm = {
    "[object Number]": () => {},
    "[object Boolean]": () => {},
    "[object String]": () => {},
    "[object Object]": (json, o) => {
      const keys = Object.keys(json || {});
      o["length"] = keys.length;
      reverse(json, o);
    },
    "[object Array]": (json, o) => {
      // reverse({});
    },
  };

  const reverse = (json, o) => {
    const keys = Object.keys(json || {});
    keys.forEach((key) => {
      const value = json[key];
      o[key] = {
        value,
        length: String(value).length,
        isArray: Array.isArray(value),
      };
      const valueType = Object.prototype.toString.call(value);
      mm[valueType]?.(value, o);
    });
  };

  // const bfs = (obj) => {
  //   const keys = Object.keys(obj);
  // };

  const o = {};
  const valueType = Object.prototype.toString.call(json);
  mm[valueType]?.(json, o);
  console.log(JSON.stringify(o));
};

calculateJsonItemPosition(json);

const s = new Board("iiiiiiiid");

// s.addItem({
//   name: "item1",
//   type: "item",
//   props: { x: 250, y: 200, width: 200, height: 200 },
// });
// s.addItem({
//   name: "item2",
//   type: "item",
//   props: { x: 100, y: 100, width: 100, height: 100 },
// });
s.addItem({
  name: "text1",
  type: "textItem",
  props: {
    x: 100,
    y: 100,
    text: "1号h阿",
    style: {
      fontSize: "18px",
    },
  },
});
