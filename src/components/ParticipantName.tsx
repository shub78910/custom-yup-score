import React from "react";

const ParticipantName = ({ fullName }: { fullName: string }) => {
  return (
    <>
      <div
        className="text-2xl text-center px-2"
        style={{
          fontFamily: "Raleway, sans-serif",
          fontWeight: 700,
        }}
      >
        {fullName}
      </div>
    </>
  );
};

export default ParticipantName;
