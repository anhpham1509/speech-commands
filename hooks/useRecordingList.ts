import { useState, useEffect } from "react";
import { deleteAudio, predictCommand } from "../handlers/recordingList";
import { Audio } from "../types/recorder";
import generateKey from "../utils/generate-key";

export default function useRecordingsList(audio: string | null) {
  const [recordings, setRecordings] = useState<Audio[]>([]);

  useEffect(() => {
    if (audio)
      setRecordings((prevState: Audio[]) => {
        return [...prevState, { key: generateKey(), audio, command: "" }];
      });
  }, [audio]);

  return {
    recordings,
    deleteAudio: (audioKey: string) => deleteAudio(audioKey, setRecordings),
    predictCommand: (audioKey: string) => predictCommand(audioKey, recordings, setRecordings)
  };
}