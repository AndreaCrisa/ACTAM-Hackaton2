Tone.Transport.bpm.value = 126;  // Set tempo to 126 BPM
Tone.Transport.timeSignature = [4, 4];  // 4/4 time signature

// Load drum samples
const kick = new Tone.Player("../DrumSamples/BD.wav").toDestination();
const snare = new Tone.Player("../DrumSamples/SNARE.wav").toDestination();
const ClosedHiHat = new Tone.Player("../DrumSamples/CHH.wav").toDestination();
const OpenHiHat = new Tone.Player("../DrumSamples/OHH.wav").toDestination();
const CLAP = new Tone.Player("../DrumSamples/CLAP.wav").toDestination();

const drumPatternIntro = new Tone.Sequence((time, note) => {
    if (note === "kick") {
        kick.start(time);
    } else if (note === "ClosedHiHat") {
        ClosedHiHat.start(time);
    } else if (note === "snare") {
        snare.start(time);
        kick.start(time);
    }
}, ["kick", "ClosedHiHat", "snare", "ClosedHiHat"], "8n");

// Create a bassline synth
const bassSynth = new Tone.AMSynth().toDestination();
bassSynth.set({
    pitchDecay: 0.05,
    octaves: 2,
    volume: 5,
});

// Sidechain compression setup for a "pumping" effect
const compressor = new Tone.Compressor({
    threshold: -30,
    knee: 40,
    ratio: 12,
    attack: 0.1,
    release: 0.2,
}).toDestination();

//bassSynth.connect(compressor);

const bassLine = new Tone.Sequence((time, note) => {
    bassSynth.triggerAttackRelease(note, "8n", time);
}, ["G1", "F1", "Eb1", "Eb1", "Eb1", "F1", "C1", "C1", "C1", "D1", "Eb1", "Eb1", "Eb1", "F1", "G1", "G1"], "4n");



// Arpeggio array
const arp = [
    "C4", "D4", "F4", "C4", "D4", "F4",
    "C4", "D4", "G4",
    "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4", "F4",
    "C4", "D4", "G4",
    "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4", "F4",
    "C4", "D4", "G4",
    "C4", "D4", "F4", "C4", "D4", "F4",
    "C4", "D4", "Bb4", "C5",
    "C4", "D4", "G4",
    "C4", "D4", "Bb4",
    "C4", "D4", "G4",
    "C4", "D4", "F4"
];

// Create a polyphonic synth for the arpeggio
const arpSynth = new Tone.PolySynth(Tone.Synth).toDestination();

// Function to play the arpeggio
function playArpeggio(arpStructure, noteDuration) {

    // Create a Tone.Sequence from the expanded structure
    const arpSequence = new Tone.Sequence((time, chord) => {
        arpSynth.triggerAttackRelease(chord, noteDuration, time); // Play each chord
    }, arp, noteDuration);

    return arpSequence;
}

const arpSequence = playArpeggio(arp, "16n");


document.getElementById("playButton").addEventListener("click", () => {
    Tone.start();
    drumPatternIntro.start(0);
    bassLine.start(0);
    arpSequence.start(0); // Start the arpeggio sequence
    Tone.Transport.start()
});

function stopCode() {
    try {
        Tone.Transport.stop();
        Tone.Transport.cancel();

        drumPatternIntro.stop(0);
        bassLine.stop(0)
        arpSequence.stop(0); // Stop the arpeggio sequence

        kick.stop();
        snare.stop();
        ClosedHiHat.stop();
        OpenHiHat.stop();
        CLAP.stop();
    } catch (err) {
        console.error('Error while stopping:', err);
    }
}

document.getElementById("stopButton").addEventListener("click", stopCode);
