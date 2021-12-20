import { SetRecordings, Audio } from "../types/recorder";
import toWav from "audiobuffer-to-wav";

export function deleteAudio(audioKey: string, setRecordings: SetRecordings) {
  setRecordings((prevState) =>
    prevState.filter((record) => record.key !== audioKey)
  );
}

export async function predictCommand(
  audioKey: string,
  recordings: Audio[],
  setRecordings: SetRecordings
) {
  const audio = recordings.find((record) => record.key === audioKey);
  console.log(audio);

  if (audio) {
    const blob = await fetch(audio.audio).then((r) => r.blob());
    const arrayBuffer = await blob.arrayBuffer();

    const audioContext = new AudioContext();
    const decodeData = await audioContext.decodeAudioData(arrayBuffer);

    const wavData = toWav(decodeData);

    let wavBlob = new Blob([wavData]);
    wavBlob = wavBlob.slice(0, wavBlob.size, "audio/wav");

    console.log(wavBlob);

    const body = new FormData();
    body.append("file", wavBlob, `${audio.key}.wav`);

    const response = await fetch("/api/hello", {
      method: "POST",
      body,
    });

    const respJson = await response.json();

    setRecordings((prevRecordings) => {
      return prevRecordings
        .filter((recording) => recording.key !== audioKey)
        .concat({ ...audio, command: respJson.prediction });
    });
  }
}
