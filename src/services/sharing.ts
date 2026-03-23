import { compress, decompress } from '../lib/compression';
import type { SamplingPoint, SamplingType, SharePayload } from '../types/plan';

const TYPE_MAP: Record<SamplingType, 'r' | 'g' | 'c'> = {
  random: 'r',
  grid: 'g',
  clustered: 'c',
};

const REVERSE_TYPE_MAP: Record<string, SamplingType> = {
  r: 'random',
  g: 'grid',
  c: 'clustered',
};

export function encodePlan(
  name: string,
  points: SamplingPoint[],
  type: SamplingType
): string {
  const payload: SharePayload = {
    v: 1,
    n: name,
    p: points.map((pt) => [
      Math.round(pt.lng * 1e6) / 1e6,
      Math.round(pt.lat * 1e6) / 1e6,
    ]),
    t: TYPE_MAP[type],
  };
  return compress(JSON.stringify(payload));
}

export interface DecodedPlan {
  name: string;
  points: SamplingPoint[];
  type: SamplingType;
}

export function decodePlan(encoded: string): DecodedPlan {
  const json = decompress(encoded);
  const payload = JSON.parse(json) as SharePayload;
  if (payload.v !== 1) throw new Error('Unsupported plan version');
  return {
    name: payload.n,
    points: payload.p.map(([lng, lat]) => ({ lng, lat })),
    type: REVERSE_TYPE_MAP[payload.t] || 'random',
  };
}
