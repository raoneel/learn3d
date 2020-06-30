import * as functions from "firebase-functions";

export function throwAuthError() {
  throw new functions.https.HttpsError(
    "failed-precondition",
    "The function must be called while authenticated."
  );
}

export function throwDataError() {
  throw new functions.https.HttpsError(
    "invalid-argument",
    "Invalid function call"
  );
}
