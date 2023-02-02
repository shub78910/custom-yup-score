import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { Button } from "antd";

export const Home = () => {
  const navigate = useNavigate();

  const createNewSession = async () => {
    const newSessionCollection = db.collection("Sessions").doc();

    await newSessionCollection.set({
      timestamp: new Date(),
      scoreCount: 0,
    });

    navigate(`/host/${newSessionCollection.id}`, { state: { fromHome: true } });
  };
  return (
    <div className="m-5">
      <div>
        <Button
          onClick={createNewSession}
          size="large"
          type="primary"
          className="bg-blue-500 text-white w-72"
        >
          Create a new session
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center mt-24">
        <img
          src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/unDraw_1000_gty8.svg"
          alt="undraw"
          height={800}
          width={800}
        />
      </div>
    </div>
  );
};
