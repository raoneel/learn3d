import * as admin from "firebase-admin";

// Initialize with default credentials
admin.initializeApp();
let db = admin.firestore();

const WORKSPACE_COLLECTION = "workspaces";

export async function saveWorkspaceFirestore(
  workspaceData: string,
  workspaceType: WorkspaceType,
  authorUid: string
) {
  // TODO handle collisions
  let workspaceId = makeId(8);

  await db.collection(WORKSPACE_COLLECTION).doc(workspaceId).create({
    workspaceData,
    workspaceType,
    authorUid,
    createDate: new Date()
  });

  return workspaceId;
}

function makeId(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
