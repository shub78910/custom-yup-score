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
          <div className="bg-blue-200 text-gray-700 h-60 w-44 m-4 rounded-lg flex flex-col justify-center items-center">
            <div className="text-8xl mb-16">{participant.score}</div>
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
          <div className="bg-blue-200 text-gray-700 h-60 w-44 m-4 rounded-lg flex flex-col justify-center items-center">
            <div>
              {participant.status === statusType.SCORING ? (
                <div className="text-center">
                  <div>
                    <Spin
                      indicator={antIcon}
                      className="text-xl font-semibold text-gray-600"
                    />
                  </div>
                  <div
                    className="text-2xl"
                    style={{
                      fontFamily: "Raleway, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {participant.fullName}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-16">
                    <CheckCircleOutlined style={{ fontSize: "72px" }} />
                  </div>
                  <div
                    className="text-2xl"
                    style={{
                      fontFamily: "Raleway, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {participant.fullName}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ParticipantCard;
