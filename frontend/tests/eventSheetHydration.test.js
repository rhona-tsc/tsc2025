import test from "node:test";
import assert from "node:assert/strict";

import {
  hasSavedEventSheet,
  resolveEventSheetHydration,
} from "../src/utils/eventSheetHydration.js";

test("saved server answers and completion state override a stale browser cache", () => {
  const result = resolveEventSheetHydration({
    serverEventSheet: {
      answers: { song_suggestions: "Crazy in Love - Beyonce" },
      complete: { first_dance: true },
      updatedAt: "2026-10-19T17:23:28.539Z",
    },
    cachedEventSheet: {
      answers: {},
      complete: {},
      updatedAt: "2026-10-18T10:00:00.000Z",
    },
  });

  assert.equal(result.source, "server");
  assert.equal(
    result.answers.song_suggestions,
    "Crazy in Love - Beyonce"
  );
  assert.equal(result.complete.first_dance, true);
});

test("browser cache remains a recovery fallback when no sheet was saved", () => {
  const result = resolveEventSheetHydration({
    serverEventSheet: null,
    cachedEventSheet: {
      answers: { venue_name: "Recovered venue" },
      complete: { venue: true },
    },
  });

  assert.equal(result.source, "cache");
  assert.equal(result.answers.venue_name, "Recovered venue");
  assert.equal(result.complete.venue, true);
});

test("an explicitly saved empty server sheet is still authoritative", () => {
  const serverEventSheet = {
    answers: {},
    complete: {},
    submitted: false,
    updatedAt: "2026-10-21T12:00:00.000Z",
  };

  assert.equal(hasSavedEventSheet(serverEventSheet), true);

  const result = resolveEventSheetHydration({
    serverEventSheet,
    cachedEventSheet: {
      answers: { obsolete_answer: "stale" },
      complete: { obsolete_section: true },
    },
  });

  assert.equal(result.source, "server");
  assert.deepEqual(result.answers, {});
  assert.deepEqual(result.complete, {});
});
