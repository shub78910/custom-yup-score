import { createContext, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./components/Home";
import { Host } from "./components/Host";
import { Participant } from "./components/Participant";

export const AppContext = createContext({});

function App() {
  const [inviteId, setInviteId] = useState("");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/host/:inviteId",
      element: <Host />,
    },
    {
      path: "/participant/:inviteId",
      element: <Participant />,
    },
  ]);

  return (
    <div className="App">
      <AppContext.Provider value={{ inviteId, setInviteId }}>
        <Header />
        <RouterProvider router={router} />
      </AppContext.Provider>
    </div>
  );
}

export default App;
