import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeChunks, mergeSegments } from './audio-chunks.mjs';

test('each chunk is an independent PCM WAV with correct offsets and sizes', () => {
  const source = Float32Array.from({length: 25}, (_, i) => i / 25);
  const buffer = { sampleRate: 10, length: 25, numberOfChannels: 1, getChannelData: () => source };
  const chunks = [...encodeChunks(buffer, { sampleRate: 8000, seconds: 1 })];
  assert.deepEqual(chunks.map(c => c.offsetSeconds), [0, 1, 2]);
  assert.deepEqual(chunks.map(c => c.durationSeconds), [1, 1, 0.5]);
  for (const chunk of chunks) {
    const v = new DataView(chunk.wav);
    assert.equal(String.fromCharCode(...new Uint8Array(chunk.wav, 0, 4)), 'RIFF');
    assert.equal(v.getUint32(4, true), chunk.wav.byteLength - 8);
    assert.equal(v.getUint32(40, true), chunk.wav.byteLength - 44);
    assert.equal(v.getUint32(24, true), 8000);
  }
});

test('merge preserves chronological order and translates segment times', () => {
  const merged = mergeSegments([{index: 1, offsetSeconds: 480, segments: [{start: 1, end: 2, text: 'b'}]}, {index: 0, offsetSeconds: 0, segments: [{start: 2, end: 3, text: 'a', speaker: 'S1'}]}]);
  assert.deepEqual(merged.map(s => [s.start, s.end, s.text, s.chunk]), [[2, 3, 'a', 0], [481, 482, 'b', 1]]);
});

test('rejects empty audio and segments exceeding the service limit', () => {
  assert.throws(() => [...encodeChunks({length: 0, sampleRate: 44100, numberOfChannels: 1})]);
  assert.throws(() => [...encodeChunks({}, {seconds: 501})]);
});
