// https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js

class Clock {
  constructor(autoStart) {
    this.autoStart = autoStart !== undefined ? autoStart : true;

    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;

    this.running = false;
  }

  start() {
    this.startTime = (typeof performance === 'undefined'
      ? Date
      : performance
    ).now(); // see #10732

    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }

  stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElapsedTime() {
    this.getDelta();
    return this.elapsedTime
  }

  getDelta() {
    let diff = 0;

    if (this.autoStart && !this.running) {
      this.start();
      return 0
    }

    if (this.running) {
      const newTime = (typeof performance === 'undefined'
        ? Date
        : performance
      ).now();

      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;

      this.elapsedTime += diff;
    }

    return diff
  }
}

// TODO : add pause/resume

class Raf {
  constructor(fps = 60) {
    this.rafs = {};
    this.clock = new Clock();

    this.fps = fps;
    this.latest = 0;
    this.delta = 0;
    this.optimumDeltaTime = this.frameDuration / 1000;

    this.loop();
  }

  get frameDuration() {
    return 1000 / this.fps
  }

  dispatch() {
    // clock
    const deltaTime = this.clock.getDelta();
    const time = this.clock.getElapsedTime();
    const lagSmoothing = deltaTime / (1000 / 60 / 1000);

    // callbacks
    Object.values(this.rafs)
      .sort((a, b) => {
        return a.priority - b.priority
      })
      .forEach((raf) => {
        raf.callback({ time, deltaTime, lagSmoothing });
      });
  }

  loop() {
    const now = performance.now();

    this.delta = now - this.latest;

    if (this.delta > this.frameDuration) {
      this.dispatch();
    }

    this.latest = now - (this.delta % this.frameDuration);

    requestAnimationFrame(this.loop.bind(this));
  }

  add(id, callback, priority = 0) {
    if (this.rafs[id]) {
      return
    }
    this.rafs[id] = { id, callback, priority };
  }

  remove(id) {
    delete this.rafs[id];
  }
}

export default Raf;
