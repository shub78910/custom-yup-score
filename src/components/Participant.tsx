import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal } from "antd";
import { db } from "../firebase";
import { participantRef } from "../firebaseRefs";
import statusConstants from "../constants/status.constants";
import { scorePoints } from "../constants/scores";

export const Participant = () => {
  let { inviteId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewScore, setIsNewScore] = useState(false);
  const [fullName, setFullName] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [selectedScore, setSelectedScore] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const isNewScoreRef = useRef(isNewScore);
  const fullNameRef = useRef(fullName);
  isNewScoreRef.current = isNewScore;
  fullNameRef.current = fullName;

  useEffect(() => {
    showModal();

    if (inviteId) {
      const unsubscribe = db
        .collection("Sessions")
        .doc(inviteId)
        .onSnapshot(() => {
          setIsNewScore(true);
          setShowAlert(false);
          if (fullNameRef.current) {
            setTimeout(() => {
              if (isNewScoreRef.current) {
                setShowAlert(true);
                const audio = new Audio("/audios/notify.mp3");
                audio.play();
              }
            }, 10000);
          }
        });
      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (fullName !== "") {
      setIsModalOpen(false);
      const res = await participantRef(inviteId).add({
        fullName,
        score: 0,
        status: statusConstants.SCORING,
      });

      setParticipantId(res.id);
    }
  };

  const sendScore = async (score: number) => {
    setIsNewScore(false);
    setSelectedScore(score);
    setShowAlert(false);
    await participantRef(inviteId).doc(participantId).update({
      score,
      status: statusConstants.SCORED,
    });
  };

  return (
    <div>
      <div
        className={`text-center  mt-10 ${showAlert ? "visible" : "invisible"}`}
      >
        <span className="p-2 rounded-md bg-red-400 text-white text-2xl ">
          You haven't scored yet! Score please..
        </span>
      </div>
      {!isModalOpen ? (
        <div className="flex justify-center mt-32">
          <div className="flex justify-center items-center h-full w-2/3 flex-wrap">
            {scorePoints.map((score, id) => (
              <div className="mx-10 my-5" key={id}>
                <button
                  onClick={() => sendScore(score)}
                  disabled={!isNewScore}
                  className={`border-2 border-black bg-blue-500 text-white text-center font-bold py-2 px-4 rounded-full text-3xl h-20 w-20 cursor-pointer ${
                    isNewScore ? "opacity-100" : "opacity-50"
                  } ${
                    !isNewScore && score === selectedScore && "bg-green-800"
                  }`}
                >
                  {score}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <Modal
            open={isModalOpen}
            closable={false}
            footer={[
              <Button
                className="bg-blue-500 text-white"
                type="primary"
                onClick={handleOk}
              >
                OK
              </Button>,
            ]}
          >
            <input
              type="text"
              placeholder="Enter full name"
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              onKeyUp={(e) => {
                e.key === "Enter" && handleOk();
              }}
              max="20"
              className="w-80 p-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
            />
          </Modal>
        </>
      )}
    </div>
  );
};
