import { db } from "./firebase";

export const participantRef = (inviteId: string | undefined) =>
  db.collection("Sessions").doc(inviteId).collection("participants");

export const organizationsRef = () => db.collection("Organizations");

export const organizationRef = (orgId: string) =>
  db.collection("Organizations").doc(orgId);

export const hostsRef = (orgId: string) =>
  db.collection("Organizations").doc(orgId).collection("hosts");

export const participantsRef = (orgId: string) =>
  db.collection("Organizations").doc(orgId).collection("participants");
