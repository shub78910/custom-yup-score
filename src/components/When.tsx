import React, { ReactNode } from "react";

interface WhenProps {
  isTrue: boolean;
  children: ReactNode;
}

const When = ({ isTrue, children }: WhenProps) => {
  if (!isTrue) {
    return null;
  }

  return <>{children}</>;
};

export default When;
