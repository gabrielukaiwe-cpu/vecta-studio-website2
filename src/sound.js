// One shared "who has the sound" switch, like Instagram: only one video can be unmuted at a time.
let owner = null;
const subs = new Set();
export const sound = {
  get: () => owner,
  set(id) { owner = id; subs.forEach((f) => f()); },
  toggle(id) { sound.set(owner === id ? null : id); },
  subscribe(f) { subs.add(f); return () => subs.delete(f); },
};
