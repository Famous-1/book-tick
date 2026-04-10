/**
 * Soft “music box” ambience (pentatonic, gentle). No external audio files.
 * Volume is moderate for kids’ ears (~30% master).
 */

const MASTER_GAIN = 0.3;

export type KidsMusicController = {
  start: () => void;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  isRunning: () => boolean;
};

function createController(): KidsMusicController {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let pads: OscillatorNode[] = [];
  let tickId: number | null = null;
  let noteIndex = 0;
  let ducked = false;
  /** C major pentatonic */
  const melodyHz = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33];

  const applyMasterLevel = () => {
    if (!master || !ctx) return;
    const t = ctx.currentTime;
    const target = ducked ? 0 : MASTER_GAIN;
    master.gain.cancelScheduledValues(t);
    master.gain.linearRampToValueAtTime(target, t + 0.12);
  };

  const ensureCtx = () => {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      applyMasterLevel();
    }
    return { ctx, master: master! };
  };

  const startPads = () => {
    const { ctx: c, master: m } = ensureCtx();
    pads = [261.63, 329.63, 392.0].map((freq) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.value = 0.045;
      osc.connect(g).connect(m);
      osc.start();
      return osc;
    });
  };

  const playPluck = () => {
    if (!ctx || !master || ducked) return;
    const hz = melodyHz[noteIndex % melodyHz.length];
    noteIndex += 1;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.7;

    osc.type = "triangle";
    osc.frequency.value = hz;

    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(g).connect(filter).connect(master);
    osc.start(t);
    osc.stop(t + 0.6);
  };

  const beginPlayback = () => {
    if (tickId !== null) return;
    startPads();
    playPluck();
    tickId = window.setInterval(playPluck, 520);
    applyMasterLevel();
  };

  return {
    start() {
      if (tickId !== null) return;
      const { ctx: c } = ensureCtx();
      const kickoff = () => beginPlayback();
      if (c.state === "suspended") {
        void c.resume().then(kickoff);
      } else {
        kickoff();
      }
    },

    stop() {
      ducked = false;
      if (tickId !== null) {
        clearInterval(tickId);
        tickId = null;
      }
      pads.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      pads = [];
      noteIndex = 0;
      if (ctx?.state !== "closed") {
        void ctx?.close();
      }
      ctx = null;
      master = null;
    },

    setMuted(m: boolean) {
      ducked = m;
      applyMasterLevel();
    },

    isRunning() {
      return tickId !== null;
    },
  };
}

let singleton: KidsMusicController | null = null;

export function getKidsBackgroundMusic(): KidsMusicController {
  if (!singleton) singleton = createController();
  return singleton;
}
