export const getAudioMfccs = (
  pcm: any,
  sampleRate: any,
  windowSize: any,
  windowStride: any,
  upperFrequencyLimit = 4000,
  lowerFrequencyLimit = 20,
  filterbankChannelCount = 40,
  dctCoefficientCount = 13
) => {
  let pcmPtr = (window as any).Module._malloc(8 * pcm.length);
  let lenPtr = (window as any).Module._malloc(4);

  for (let i = 0; i < pcm.length; i++) {
    (window as any).Module.HEAPF64[pcmPtr / 8 + i] = pcm[i];
  }
  (window as any).Module.HEAP32[lenPtr / 4] = pcm.length;

  let tfMfccs = (window as any).Module.cwrap("tf_mfccs", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  let mfccsPtr = tfMfccs(
    pcmPtr,
    lenPtr,
    sampleRate,
    windowSize,
    windowStride,
    upperFrequencyLimit,
    lowerFrequencyLimit,
    filterbankChannelCount,
    dctCoefficientCount
  );
  let mfccsLen = (window as any).Module.HEAP32[lenPtr >> 2];
  let audioMfccs = [mfccsLen];

  for (let i = 0; i < mfccsLen; i++) {
    audioMfccs[i] = (window as any).Module.HEAPF64[(mfccsPtr >> 3) + i];
  }

  (window as any).Module._free(pcmPtr, lenPtr, mfccsPtr);

  return audioMfccs;
};
