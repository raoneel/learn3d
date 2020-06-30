interface SaveWorkspaceInputData {
  workspaceData: string;
  workspaceType: WorkspaceType;
}

type WorkspaceType = "BLOCKS" | "TEXT";

type WorkspaceResult = SaveWorkspaceInputData & {
  authorUid: string;
}