import { Button } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { db } from "../firebase";
import { participantRef } from "../firebase.config";
import ParticipantCard from "./ParticipantCard";
import statusType from "../constants/status.constants";
import { CheckOutlined, ArrowLeftOutlined } from "@ant-design/icons";

export const Host = () => {
  let { inviteId } = useParams();
  const [participants, setParticipants] = useState<any>([]);
  const [majorityScore, setMajorityScore] = useState<number>(0);
  const [copyText, setCopyText] = useState<string>("Copy");
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.fromHome) {
    navigate("/");
  }

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
              className="m-2 border-black border-2 rounded-md p-2 w-24 flex items-center justify-center"
            >
              <span className="mr-2">{copyText}</span>
              <span className="mb-1">
                {copyText === "Copied" && <CheckOutlined />}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="m-5 flex flex-wrap justify-between items-center">
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
        <div>
          <span className="bg-blue-400 rounded-md text-white text-2xl p-4 px-16">
            Majority Score: {majorityScore}
          </span>
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
    </div>
  );
};
