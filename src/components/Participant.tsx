import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal } from "antd";
import { db } from "../firebase";
import { participantRef } from "../firebase.config";
import statusConstants from "../constants/status.constants";

export const Participant = () => {
  let { inviteId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOKClicked, setIsOKClicked] = useState(false);
  const [isNewScore, setIsNewScore] = useState(false);
  const [fullName, setFullName] = useState("");
  const [selectedScore, setSelectedScore] = useState(0);
  const isNewScoreRef = useRef(isNewScore);
  const fullNameRef = useRef(fullName);
  isNewScoreRef.current = isNewScore;
  fullNameRef.current = fullName;

  const scorePoints = [1, 2, 3, 5, 8, 13, 20, 34, 55, 80];

  useEffect(() => {
    if (inviteId) {
      db.collection("Sessions")
        .doc(inviteId)
        .onSnapshot(() => {
          setIsNewScore(true);
          if (fullNameRef.current) {
            setTimeout(() => {
              if (isNewScoreRef.current) {
                const audio = new Audio("/audios/notify.mp3");
                audio.play();
              }
            }, 10000);
          }
        });
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    showModal();
  }, []);

  const handleOk = () => {
    if (fullName !== "") {
      setIsModalOpen(false);
      setIsOKClicked(true);
      participantRef(inviteId).add({
        fullName,
        score: 0,
        status: statusConstants.SCORING,
      });
    }
  };

  const sendScore = async (score: any) => {
    setIsNewScore(false);
    setSelectedScore(score);
    await participantRef(inviteId)
      .where("fullName", "==", fullName)
      .get()
      .then(async (querySnapshot) => {
        const docToUpdate = querySnapshot.docs[0].id;
        participantRef(inviteId).doc(docToUpdate).update({
          score,
          status: statusConstants.SCORED,
        });
      });
  };
  return (
    <div>
      {isOKClicked ? (
        <div className="flex justify-center">
          {/* <div>Score among the following</div> */}
          <div className="flex justify-center items-center h-full w-1/2 flex-wrap">
            {scorePoints.map((score, id) => (
              <div className="m-8">
                <button
                  onClick={() => sendScore(score)}
                  disabled={!isNewScore}
                  className={`border-2 border-black bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-3xl h-28 w-28 cursor-pointer ${
                    isNewScore ? "opacity-100" : "opacity-50"
                  } ${
                    !isNewScore && score === selectedScore && "bg-green-500"
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
