import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Root } from "@/routes/root";

const router = createBrowserRouter(createRoutesFromElements(<Route path="/" element={<Root />} />));

export function App() {
  return <RouterProvider router={router} />;
}
