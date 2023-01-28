import { Button } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import { participantRef } from "../firebase.config";
import ParticipantCard from "./ParticipantCard";
import statusType from "../constants/status.constants";

export const Host = () => {
  let { inviteId } = useParams();
  const [participants, setParticipants] = useState<any>([]);
  const [majorityScore, setMajorityScore] = useState<any>(0);

  useEffect(() => {
    if (inviteId) {
      participantRef(inviteId).onSnapshot((snapshot) => {
        let refData = snapshot.docs.map((doc) => doc.data());
        const refId = snapshot.docs.map((doc) => doc.id);
        refData.forEach((item) => (item.id = refId[refData.indexOf(item)]));
        setParticipants(refData);
      });
    }
  }, []);

  const handleNewScore = async () => {
    let currentScoreCount;
    await db
      .collection("Sessions")
      .doc(inviteId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          currentScoreCount = doc.data()?.scoreCount;
        }
      });

    const newScore = (currentScoreCount ?? 0) + 1;

    await db.collection("Sessions").doc(inviteId).update({
      scoreCount: newScore,
    });

    await db
      .collection("Sessions")
      .doc(inviteId)
      .collection("participants")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          participantRef(inviteId).doc(doc.id).update({
            score: 0,
            status: statusType.SCORING,
          });
        });
      });
  };

  const showScore = async () => {
    calculateMajorityScore();

    console.log("updating status");

    await db
      .collection("Sessions")
      .doc(inviteId)
      .collection("participants")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          participantRef(inviteId).doc(doc.id).update({
            status: statusType.REVEAL,
          });
        });
      });
  };

  const calculateMajorityScore = () => {
    let scores = participants.map((item: any) => item.score);
    let majorityScore = scores
      .sort(
        (a: number, b: number) =>
          scores.filter((v: number) => v === a).length -
          scores.filter((v: number) => v === b).length
      )
      .pop();

    setMajorityScore(majorityScore);
  };

  return (
    <div>
      <div className="mt-10 m-5 flex justify-between items-center">
        <div>
          <Button
            onClick={handleNewScore}
            size="large"
            type="primary"
            className="w-28 m-3 bg-blue-500 text-white"
          >
            NEW
          </Button>
          <Button size="large" className="w-28 m-3" onClick={showScore}>
            REVEAL
          </Button>
        </div>
        <div>
          <div className="font-semibold mb-2">
            Share this with other participants
          </div>
          <div className="flex">
            <div className="bg-blue-200 p-2 rounded-md flex items-center">
              https://scoreMe.web.app/participant/
              {inviteId}
            </div>
            <button
              onClick={() => {
                navigator.clipboard
                  .writeText(`https://scoreMe.web.app/participant/
            ${inviteId}`);
              }}
              className="m-2 border-black border-2 rounded-md p-2"
            >
              COPY TO CLIPBOARD
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap">
        {participants?.map((participant: any) => (
          <ParticipantCard
            {...{
              participant,
              inviteId,
            }}
          />
        ))}
      </div>

      <div className="mt-16 m-5">
        <span className="bg-blue-300 text-white text-2xl p-4">
          Majority Score: {majorityScore}
        </span>
      </div>
    </div>
  );
};
