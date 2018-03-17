const utils = require("./util.js");

const LevelEnum = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error"
};

const ColorEnum = {
  log: "black",
  info: "DodgerBlue",
  warn: "orange",
  error: "red"
};

module.exports = {
  debug: function(...args) {
    this.print(LevelEnum.debug, ColorEnum.log, ...args);
  },

  info: function(...args) {
    this.print(LevelEnum.info, ColorEnum.info, ...args);
  },

  warn: function(...args) {
    this.print(LevelEnum.warn, ColorEnum.warn, ...args);
  },

  error: function(...args) {
    this.print(LevelEnum.error, ColorEnum.error, ...args);
    //如果第一个参数是Error，则打印异常堆栈
    if (args[1] instanceof Error) {
      console.trace();
    } else {
    }
  },

  /**
   * log 和 info是一个实现，warn和error不支持颜色，浏览器自动高亮颜色,
   * debug对应verbose(Chrome支持)
   * @param {*} level
   * @param {*} color
   * @param {*} args
   */
  print: function(level, color, ...args) {
    if (LevelEnum.error == level) {
      console.error(`[${utils.formatTime(new Date())}]`, ...args);
    } else if (LevelEnum.warn == level) {
      console.warn(`[${utils.formatTime(new Date())}]`, ...args);
    } else if (LevelEnum.info == level) {
      console.info(
        `%c [${utils.formatTime(new Date())}]`,
        `color:${color}`,
        ...args
      );
    } else if (LevelEnum.debug == level) {
      console.debug(
        `%c [${utils.formatTime(new Date())}]`,
        `color:${color}`,
        ...args
      );
    }
  }
};
