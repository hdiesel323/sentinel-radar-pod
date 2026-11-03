// agent-workspace#185 C1: every pod route except /health requires the hub token.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { authGate } from "../src/auth.js";

const env = { FACTORY_HUB_TOKEN: "pod-secret" };
const req = (method: string, path: string, auth?: string) =>
  new Request(`https://pod.test${path}`, { method, headers: auth ? { Authorization: auth } : {} });

describe("pod auth gate", () => {
  test("health is open", () => assert.equal(authGate(req("GET", "/health"), env), null));
  test("task injection without a credential is rejected", () => {
    assert.equal(authGate(req("POST", "/api/task"), env)!.status, 401);
    assert.equal(authGate(req("GET", "/api/tasks"), env)!.status, 401);
    assert.equal(authGate(req("GET", "/"), env)!.status, 401);
  });
  test("wrong token is rejected; bearer and basic with the right token pass", () => {
    assert.equal(authGate(req("POST", "/api/task", "Bearer nope"), env)!.status, 401);
    assert.equal(authGate(req("POST", "/api/task", "Bearer pod-secret"), env), null);
    assert.equal(authGate(req("GET", "/", `Basic ${btoa("op:pod-secret")}`), env), null);
  });
  test("fails closed without a configured token", () => {
    assert.equal(authGate(req("GET", "/api/tasks", "Bearer pod-secret"), {})!.status, 401);
  });
});
