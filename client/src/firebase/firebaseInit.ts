import * as firebase from "firebase";
import "firebase/functions";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAfJN2RrWrmSA-Ye1qj0eSvNjzet1vj96Y",
  authDomain: "learn3d-c7053.firebaseapp.com",
  databaseURL: "https://learn3d-c7053.firebaseio.com",
  projectId: "learn3d-c7053",
  storageBucket: "learn3d-c7053.appspot.com",
  messagingSenderId: "420486069801",
  appId: "1:420486069801:web:c2a238f525f6356156a638",
});

firebase
  .auth()
  .signInAnonymously()
  .catch(function (error) {
    // var errorCode = error.code;
    // var errorMessage = error.message;
    console.error(error);
  });

export let db = firebase.firestore();

// Local testing mode
if (window.location.hostname === "localhost") {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });

  firebase.functions().useFunctionsEmulator("http://localhost:5001");
}

export let saveWorkspaceFn = (firebase
  .functions()
  .httpsCallable("saveWorkspace") as unknown) as (
  data: SaveWorkspaceInputData
) => Promise<{ data: string }>;

export async function getWorkspace(
  workspaceId: string
): Promise<WorkspaceResult | undefined> {
  let doc = await db.collection("workspaces").doc(workspaceId).get();
  if (doc.exists) {
    return (doc.data() as unknown) as WorkspaceResult;
  } else {
    return undefined;
  }
}
