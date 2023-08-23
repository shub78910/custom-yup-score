import statusType from "../constants/status.constants";
import { Popconfirm, Spin, Tooltip } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Participant } from "../types/types";
import When from "./When";
import { AiFillDelete } from "react-icons/ai";
import ParticipantName from "./ParticipantName";
import { useState } from "react";
import { participantRef } from "../firebaseRefs";

const ParticipantCard = ({
  participant,
  inviteId,
}: {
  participant: Participant;
  inviteId: string | undefined;
}) => {
  const [showDeletePopUp, setShowDeletePopUp] = useState<boolean>(false);

  const deleteParticipant = (id: string) => {
    participantRef(inviteId).doc(id).delete();
    setShowDeletePopUp(false);
  };

  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 72 }}
      className="mb-20 text-blue-500"
      spin
    />
  );

  return (
    <>
      <div className="bg-blue-200 text-gray-700 h-72 w-44 m-4 rounded-lg flex flex-col justify-center items-center relative">
        <div className="my-2 absolute top-0 right-0 mr-2">
          <Popconfirm
            title="Are you sure, you want to delete this participant?"
            open={showDeletePopUp}
            onConfirm={() => deleteParticipant(participant.id)}
            onCancel={() => setShowDeletePopUp(false)}
          >
            <Tooltip placement="top" title="Kick out participant">
              <button onClick={() => setShowDeletePopUp(true)}>
                <AiFillDelete size={20} color="black" />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
        <When isTrue={participant.status === statusType.REVEAL}>
          <div className="text-8xl mb-10 mt-2">{participant.score}</div>
          <div>
            <ParticipantName {...{ fullName: participant.fullName }} />
          </div>
        </When>

        <When isTrue={participant.status === statusType.SCORING}>
          <div className="text-center">
            <div>
              <Spin
                indicator={antIcon}
                className="text-xl font-semibold text-gray-600"
              />
            </div>
            <ParticipantName {...{ fullName: participant.fullName }} />
          </div>
        </When>

        <When isTrue={participant.status === statusType.SCORED}>
          <div className="text-center">
            <div className="mb-16">
              <CheckCircleOutlined style={{ fontSize: "72px" }} />
            </div>
            <ParticipantName {...{ fullName: participant.fullName }} />
          </div>
        </When>
      </div>
    </>
  );
};

export default ParticipantCard;
