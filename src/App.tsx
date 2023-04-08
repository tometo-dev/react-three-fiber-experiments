import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { RootLayout, Home } from "@/routes/root";
import { HauntedHouse } from "@/routes/haunted-house";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="haunted-house" element={<HauntedHouse />} />
    </Route>,
  ),
);

export function App() {
  return <RouterProvider router={router} />;
}
