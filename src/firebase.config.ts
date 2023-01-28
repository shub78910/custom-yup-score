import { db } from "./firebase";

export const participantRef = (inviteId: string | undefined) =>
  db.collection("Sessions").doc(inviteId).collection("participants");
