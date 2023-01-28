import statusType from "../constants/status.constants";
import { Spin } from "antd";
import { LoadingOutlined, CheckCircleOutlined } from "@ant-design/icons";

const ParticipantCard = ({ participant, scoreStatus }: any) => {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 72 }}
      className="mb-20 text-blue-500"
      spin
    />
  );

  return (
    <>
      {participant.status === statusType.REVEAL ? (
        <>
          <div className="bg-blue-200 text-gray-700 h-80 w-52 m-4 flex flex-col justify-center items-center">
            <div className="text-8xl mb-5">{participant.score}</div>
            <div
              className="text-2xl"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700 }}
            >
              {participant.fullName}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue-200 text-gray-700 h-80 w-52 m-4 flex flex-col justify-center items-center">
            <div>
              {participant.status === statusType.SCORING ? (
                <>
                  <div>
                    <Spin
                      indicator={antIcon}
                      tip="Scoring..."
                      className="text-xl font-semibold text-gray-600"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <CheckCircleOutlined style={{ fontSize: "72px" }} />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ParticipantCard;
