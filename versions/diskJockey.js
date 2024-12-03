// Helper to create a chain for each element
const createChannelWithEffects = (volume = -6) => {
    const gain = new Tone.Volume(volume);
    const filter = new Tone.Filter(20000, "lowpass");
    const reverb = new Tone.Reverb({ decay: 3, wet: 0.5 });
    gain.chain(filter, reverb, Tone.Destination);
    return { gain, filter, reverb };
};

// Elements with individual effects
const kickChannel = createChannelWithEffects();
const kick = new Tone.Player("../DrumSamples/BD.wav").connect(kickChannel.gain);

const snareClapChannel = createChannelWithEffects();
const snare = new Tone.Player("../DrumSamples/SNARE.wav").connect(snareClapChannel.gain);
const clap = new Tone.Player("../DrumSamples/CLAP.wav").connect(snareClapChannel.gain);

const hiHatChannel = createChannelWithEffects();
const closedHiHat = new Tone.Player("../DrumSamples/CHH.wav").connect(hiHatChannel.gain);
const openHiHat = new Tone.Player("../DrumSamples/OHH.wav").connect(hiHatChannel.gain);

const bassChannel = createChannelWithEffects();
const bassSynth = new Tone.AMSynth().connect(bassChannel.gain);

const arpChannel = createChannelWithEffects();
const arpSynth = new Tone.PolySynth(Tone.Synth).connect(arpChannel.gain);

const riffChannel = createChannelWithEffects();
const mainRiffSynth = new Tone.PolySynth(Tone.Synth).connect(riffChannel.gain);

let elementsIDMapping = {
    0: "kick",
    1: "snare",
    2: "hiHat",
    3: "bass",
    4: "arp",
    5: "riff",
}

let elementsStatus = {
    "kick": true,
    "snare": true,
    "hiHat": true,
    "bass": true,
    "arp": true,
    "riff": true,
}

let enableClap = false;
let enableOpenHiHat = false;

Array.from(document.getElementsByClassName("toggleButton")).forEach((item, index) => {
    item.addEventListener("click", () => {
        item.classList.toggle("activeToggle", !elementsStatus[elementsIDMapping[index]])
        elementsStatus[elementsIDMapping[index]] = !elementsStatus[elementsIDMapping[index]]
    })
})

let toggleClap = document.getElementById("toggleClap") 

toggleClap.addEventListener("click", () => {
    enableClap = !enableClap
    toggleClap.classList.toggle("activeAlternateModeButton", enableClap)
})


let toggleOHH = document.getElementById("toggleOpenHiHat") 

toggleOHH.addEventListener("click", () => {
    enableOpenHiHat = !enableOpenHiHat
    toggleOHH.classList.toggle("activeAlternateModeButton", enableOpenHiHat)
})

// Drum pattern
const drumPatternIntro = new Tone.Sequence((time, note) => {
    if (elementsStatus["kick"] && note === "kick") {
        kick.start(time);
    }
    if (elementsStatus["snare"] && note === "snare") {
        if(enableClap)
            clap.start(time);
        else
            snare.start(time);
    }
    if (elementsStatus["hiHat"] && note === "ClosedHiHat") {
        if(enableOpenHiHat)
            openHiHat.start(time);
        else
            closedHiHat.start(time);
    }
}, ["kick", "ClosedHiHat", "snare", "ClosedHiHat"], "8n");

// Bassline
const bassLine = new Tone.Sequence((time, note) => {
    if (elementsStatus["bass"]) {
        bassSynth.triggerAttackRelease(note, "8n", time);
    }
}, ["G2", "F2", "Eb2", "Eb2", "Eb2", "F2", "C2", "C2", "C2", "D2", "Eb2", "Eb2", "Eb2", "F2", "G2", "G2"], "4n");

// Arpeggio
const arpSequence = new Tone.Sequence((time, note) => {
    if (elementsStatus["arp"]) {
        arpSynth.triggerAttackRelease(note, "16n", time);
    }
}, ["C4", "D4", "F4", "C4", "D4", "F4",
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
    "C4", "D4", "F4"], "16n");

// Main riff
const mainRiffL = new Tone.Sequence((time, note) => {
    if (elementsStatus["riff"]) {
        mainRiffSynth.triggerAttackRelease(note, "16n", time);
    }
}, ["G4", null, "G4", null, "F4", null, "F4", null, "D4", "D4", null, "D4", null, "D4", null, null], "16n");

const mainRiffH = new Tone.Sequence((time, note) => {
    if (elementsStatus["riff"]) {
        mainRiffSynth.triggerAttackRelease(note, "16n", time);
    }
}, ["Bb4", null, "Bb4", null, "A4", null, "A4", null, "G4", "G4", null, "G4", null, "G4", null, null], "16n");


// Update controls
function updateControl(channel, volumeId, reverbId, filterId) {
    document.getElementById(volumeId).addEventListener("input", (e) => {
        channel.gain.volume.value = e.target.value;
    });
    document.getElementById(reverbId).addEventListener("input", (e) => {
        channel.reverb.wet.value = e.target.value;
    });
    document.getElementById(filterId).addEventListener("input", (e) => {
        channel.filter.frequency.value = e.target.value;
    });
}

// Attach controls
updateControl(kickChannel, "kickVolume", "kickReverb", "kickFilter");
updateControl(snareClapChannel, "snareVolume", "snareReverb", "snareFilter");
updateControl(hiHatChannel, "hiHatVolume", "hiHatReverb", "hiHatFilter");
updateControl(bassChannel, "bassVolume", "bassReverb", "bassFilter");
updateControl(arpChannel, "arpVolume", "arpReverb", "arpFilter");
updateControl(riffChannel, "riffVolume", "riffReverb", "riffFilter");

// Start/Stop buttons
document.getElementById("playButton").addEventListener("click", () => {
    Tone.start();
    drumPatternIntro.start(0);
    bassLine.start(0);
    arpSequence.start(0);
    mainRiffL.start(0);
    mainRiffH.start(0);
    Tone.Transport.start();
});

document.getElementById("stopButton").addEventListener("click", () => {
    Tone.Transport.stop();
    drumPatternIntro.stop(0);
    bassLine.stop(0);
    arpSequence.stop(0);
    mainRiffL.stop(0);
    mainRiffH.stop(0);
    Tone.Transport.cancel();
});