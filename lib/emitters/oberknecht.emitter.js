const i = require("..");

class oberknechtEmitter {
  #symbol = Symbol();
  get symbol() { return this.#symbol };

  constructor() {
    i.emitterData[this.symbol] = {
      "events": {}
    };
  };

  on = (eventName, callback) => {
    if (!Array.isArray(eventName)) eventName = [eventName];

    eventName.forEach((eventName2) => {
      if (!i.emitterData[this.symbol].events[eventName2]) {
        i.emitterData[this.symbol].events[eventName2] = [];
      }

      i.emitterData[this.symbol].events[eventName2].push(callback);
    });
  };

  addListener = this.on;

  once = (eventName, callback) => {
    if (!Array.isArray(eventName)) eventName = [eventName];
    const onceCallback = (args) => {
      this.removeListener(eventName, onceCallback);
      callback(args);
    };

    this.on(eventName, onceCallback);
  };

  removeListener = (eventName, callback) => {
    if (!i.emitterData[this.symbol].events[eventName]) return;

    i.emitterData[this.symbol].events[eventName] = i.emitterData[this.symbol].events[eventName].filter(
      (cb) => cb !== callback
    );
  };

  removeAllListeners = (eventName) => {
    if (!i.emitterData[this.symbol].events[eventName]) return;

    delete i.emitterData[this.symbol].events[eventName];
  };

  getListeners = (eventName) => {
    return i.emitterData[this.symbol].events[eventName] || [];
  };

  emit = (eventName, args) => {
    if (!Array.isArray(eventName)) eventName = [eventName];

    eventName.forEach((eventName2) => {
      this.getListeners(eventName2).forEach((callback) => {
        callback(args ?? undefined);
      });
      this.getListeners("_all").forEach((callback) => {
        callback(args ?? undefined);
      })
    });
  };

  emitError = (eventName, error) => {
    try {
      if (!error) return;
      if (this.getListeners("error").length === 0 && this.getListeners("unhandledRejection").length === 0) {
        // process.emitWarning((error?.error?.message ?? error.error ?? error?.message ?? error));
      };
      this.emit(["error"].concat(eventName), (error instanceof Error ? Error("Oida", { "cause": error }) : Error((error?.error?.message ?? error?.error ?? error?.message ?? error))));
    } catch (e) {
      console.error(Error(error));
    };
  };
};

module.exports = oberknechtEmitter;