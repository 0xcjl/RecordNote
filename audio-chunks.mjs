// The caller supplies a decoded AudioBuffer. Each returned WAV is independent.
export function* encodeChunks(buffer, options = {}) {
  const sampleRate = options.sampleRate ?? 16000;
  const seconds = options.seconds ?? 480;
  if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 48000 ||
      !Number.isFinite(seconds) || seconds <= 0 || seconds > 500) throw new Error('无效的分段配置');
  if (!buffer || !Number.isFinite(buffer.sampleRate) || buffer.sampleRate <= 0 ||
      !Number.isInteger(buffer.length) || buffer.length <= 0 ||
      !Number.isInteger(buffer.numberOfChannels) || buffer.numberOfChannels <= 0) throw new Error('音频为空或无法解码');
  const chunkFrames = Math.floor(seconds * sampleRate);
  const totalFrames = Math.ceil(buffer.length * sampleRate / buffer.sampleRate);
  const channels = Array.from({length: buffer.numberOfChannels}, (_, i) => buffer.getChannelData(i));
  if (channels.some(c => c.length < buffer.length)) throw new Error('音频数据不完整');
  for (let offset = 0, index = 0; offset < totalFrames; offset += chunkFrames, index++) {
    const frames = Math.min(chunkFrames, totalFrames - offset);
    const wav = new ArrayBuffer(44 + frames * 2);
    const view = new DataView(wav);
    const label = (pos, value) => { for (let i = 0; i < value.length; i++) view.setUint8(pos + i, value.charCodeAt(i)); };
    label(0, 'RIFF'); view.setUint32(4, 36 + frames * 2, true); label(8, 'WAVE');
    label(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    label(36, 'data'); view.setUint32(40, frames * 2, true);
    for (let i = 0; i < frames; i++) {
      const position = (offset + i) * buffer.sampleRate / sampleRate;
      const left = Math.min(Math.floor(position), buffer.length - 1);
      const right = Math.min(left + 1, buffer.length - 1);
      const fraction = position - left;
      let value = 0;
      for (const channel of channels) value += channel[left] * (1 - fraction) + channel[right] * fraction;
      value = Math.max(-1, Math.min(1, value / channels.length));
      view.setInt16(44 + i * 2, value < 0 ? Math.round(value * 32768) : Math.round(value * 32767), true);
    }
    yield { index, offsetSeconds: offset / sampleRate, durationSeconds: frames / sampleRate, wav };
  }
}

export function mergeSegments(results) {
  const ordered = [...results].sort((a, b) => a.index - b.index);
  return ordered.flatMap(result => (result.segments ?? []).map(segment => ({
    start: result.offsetSeconds + segment.start,
    end: result.offsetSeconds + segment.end,
    speaker: segment.speaker ?? null,
    text: segment.text,
    chunk: result.index,
  })));
}
