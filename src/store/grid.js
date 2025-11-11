// src/store/grid.js
export function gridFromMessage(msg = {}) {
  return {
    total: Number(msg.totalSegments ?? 0),
    received: Array.isArray(msg.receivedSegments) ? msg.receivedSegments : [],
    late: Array.isArray(msg.lateSegments) ? msg.lateSegments : [],
    requested: Array.isArray(msg.requestedSegments) ? msg.requestedSegments : [],
  };
}
