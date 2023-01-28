import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./components/Home";
import { Host } from "./components/Host";
import { Participant } from "./components/Participant";

function App() {
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
      <Header />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
