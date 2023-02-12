import { Button } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { db } from "../firebase";
import { participantRef } from "../firebase.config";
import ParticipantCard from "./ParticipantCard";
import statusType from "../constants/status.constants";
import { CheckOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Participant } from "../types/types";

export const Host = () => {
  let { inviteId } = useParams();
  const [participants, setParticipants] = useState<any>([]);
  const [sortedScores, setSortedScores] = useState<any>([]);
  const [majorityScore, setMajorityScore] = useState<number>(0);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [copyText, setCopyText] = useState<string>("Copy");
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.fromHome) {
    navigate("/");
  }

  useEffect(() => {
    if (inviteId) {
      const unsubscribe = participantRef(inviteId).onSnapshot((snapshot) => {
        let refData = snapshot.docs.map((doc) => doc.data());
        const refId = snapshot.docs.map((doc) => doc.id);
        refData.forEach((item) => (item.id = refId[refData.indexOf(item)]));
        setParticipants(refData);
      });

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateScoreCount = async () => {
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

    updateScoreCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoreCount]);

  const handleNewScore = async () => {
    setMajorityScore(0);
    setSortedScores([]);
    setScoreCount((scoreCount) => scoreCount + 1);

    await db.collection("Sessions").doc(inviteId).update({
      scoreCount: scoreCount,
    });
  };

  const calculateMajorityScore = () => {
    let scores = participants.map(
      (participant: Participant) => participant.score
    );
    const scoresWithoutZero = scores.filter((score: number) => score !== 0);

    let majorityScore = scoresWithoutZero
      .sort(
        (a: number, b: number) =>
          scores.filter((v: number) => v === a).length -
          scores.filter((v: number) => v === b).length
      )
      .pop();

    setMajorityScore(majorityScore);
  };

  const sortScores = () => {
    let scores = participants.map(
      (participant: Participant) => participant.score
    );

    const scoresWithoutZero = scores.filter((score: number) => score !== 0);
    let sortedScores = scoresWithoutZero.sort((a: number, b: number) => b - a);

    setSortedScores(sortedScores);
  };

  const showScore = async () => {
    calculateMajorityScore();
    sortScores();

    await db;
    participantRef(inviteId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          participantRef(inviteId).doc(doc.id).update({
            status: statusType.REVEAL,
          });
        });
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://score-me-8ccc3.web.app/participant/${inviteId}`
    );

    setCopyText("Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 3000);
  };

  return (
    <div>
      <div className="m-5 mb-10 flex items-center justify-between">
        <div>
          <Button
            onClick={() => {
              navigate("/");
            }}
            size="middle"
            className="flex items-center"
          >
            <ArrowLeftOutlined />
          </Button>
        </div>

        <div>
          <div className="flex">
            <div className="bg-blue-200 p-2 rounded-md flex items-center">
              https://score-me-8ccc3.web.app/participant/
              {inviteId}
            </div>
            <button
              onClick={copyToClipboard}
              className="m-2 border-black border-2 rounded-md p-2 w-32 flex items-center justify-center"
            >
              <div className="mr-2">{copyText}</div>
              <div>{copyText === "Copied" && <CheckOutlined />}</div>
            </button>
          </div>
        </div>
      </div>
      <div className="m-5 flex flex-wrap justify-between items-start">
        <div>
          <Button
            onClick={handleNewScore}
            size="large"
            type="primary"
            className="w-28 mr-3 bg-blue-500 text-white"
          >
            NEW
          </Button>
          <Button size="large" className="w-28 m-3" onClick={showScore}>
            REVEAL
          </Button>
        </div>

        <div className="w-44 mt-2 text-left">
          <div className="m-2 bg-blue-400 rounded-md text-white text-xl pl-4 p-2">
            Majority: {majorityScore ?? 0}
          </div>
          <div className="m-2 bg-blue-400 rounded-md text-white text-xl pl-4 p-2">
            Highest: {sortedScores[0] ?? 0}
          </div>
          <div className="m-2 bg-blue-400 rounded-md text-white text-xl pl-4 p-2">
            Lowest: {sortedScores[sortedScores.length - 1] ?? 0}
          </div>
          <div className="m-2 bg-blue-400 rounded-md text-white text-xl pl-4 p-2">
            Difference:{" "}
            {isNaN(sortedScores[0] - sortedScores[sortedScores?.length - 1])
              ? 0
              : sortedScores[0] - sortedScores[sortedScores?.length - 1]}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap">
        {participants?.map((participant: Participant) => (
          <ParticipantCard {...participant} />
        ))}
      </div>
    </div>
  );
};
