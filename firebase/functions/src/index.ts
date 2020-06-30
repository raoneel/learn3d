import * as functions from "firebase-functions";
import { saveWorkspaceFirestore} from "./db";
import { throwDataError, throwAuthError } from "./errors";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const saveWorkspace = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid) {
    return throwAuthError();
  }

  // Validate incoming data
  if (!data) {
    return throwDataError();
  }

  if (!data.workspaceData || typeof data.workspaceData !== "string") {
    return throwDataError();
  }

  if (!data.workspaceType || typeof data.workspaceType !== "string") {
    return throwDataError();
  }

  // Save to Firestore document
  let workspaceId = await saveWorkspaceFirestore(
    data.workspaceData,
    data.workspaceType,
    context.auth.uid
  );

  // Return unique ID
  return workspaceId;
});
