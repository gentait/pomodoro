class Timer {
  constructor() {
    this.hand = document.querySelector(".hand");
    this.time = document.querySelector(".time");
    this.button = document.querySelector(".button");
    this.body = document.body;
    this.startTimer = this.startTimer.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.sound = document.querySelector("#sound");
  }
  timerId;
  isStartButton = true;
  pastMs = 0;
  pastMsAll = 0;
  startTimer(minutes, isWorkTime) {
    this.button.textContent = "STOP";
    this.isStartButton = false;
    this.body.style.backgroundColor = isWorkTime
      ? "rgb(250, 124, 74)"
      : "rgb(114, 224, 182)";
    const settingMs = minutes * 60 * 1000;
    const hand = document.querySelector(".hand");
    const time = document.querySelector(".time");
    const interval = new Promise(resolve => {
      const startMs = Date.now();
      this.timerId = setInterval(() => {
        const currentMs = Date.now();
        this.pastMs = currentMs - startMs;
        const diffMs = this.pastMs + this.pastMsAll;
        if (diffMs < settingMs) {
          const deg = Math.floor(360 * (diffMs / settingMs));
          hand.style.transform = `rotate(${deg}deg)`;
          const mm = Math.floor((settingMs - diffMs) / (60 * 1000))
            .toString()
            .padStart(2, "0");
          const ss = Math.floor(((settingMs - diffMs) % (60 * 1000)) / 1000)
            .toString()
            .padStart(2, "0");
          time.textContent = `${mm}:${ss}`;
        } else {
          clearInterval(this.timerId);
          this.pastMsAll = 0;
          this.sound.play();
          resolve();
        }
      }, 250);
    });
    return interval;
  }
  async clickHandler() {
    if (this.isStartButton) {
      while (true) {
        await this.startTimer(1, true);
        new Notification("お疲れ様でした");
        await this.startTimer(1, false);
        new Notification("作業を開始しましょう");
      }
    } else {
      clearInterval(this.timerId);
      this.isStartButton = true;
      this.button.textContent = "START";
      this.pastMsAll += this.pastMs;
    }
  }
}
if (Notification.permission == "default") Notification.requestPermission();
const timer = new Timer();
document.querySelector(".button").addEventListener("click", timer.clickHandler);
