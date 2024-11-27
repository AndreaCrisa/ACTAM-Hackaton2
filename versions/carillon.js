Tone.Transport.bpm.value = 126;  // Set tempo to 126 BPM
Tone.Transport.timeSignature = [4, 4];  // 4/4 time signature

const kick = new Tone.Player("./DrumSamples/BD.wav").toDestination();
const snare = new Tone.Player("./DrucmSamples/SNARE.wav").toDestination();
const ClosedHiHat = new Tone.Player("./DrumSamples/CHH.wav").toDestination();
const OpenHiHat = new Tone.Player("./DrumSamples/OHH.wav").toDestination();
const CLAP = new Tone.Player("./DrumSamples/CLAP.wav").toDestination();

const drumPatternIntro = new Tone.Sequence((time, note) => {
    if (note === "kick") {
        kick.start(time);  // Start kick at the specified time
    } else if (note === "hihat") {
        hiHat.start(time);  // Start hi-hat at the specified time
    }
    else if (note === "snare") {
        hiHat.start(time);  // Start hi-hat at the specified time
    }
}, ["kick", "ClosedHihat", "snare", "ClosedHihat"], "8n");  // Very minimal rhythm

document.querySelector("#playButton").addEventListener("click", () => {
    Tone.start();
    drumPattern.start();
});