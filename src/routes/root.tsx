import { Link, Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <>
      <nav className="flex gap-2">
        <Link to="/">Home</Link>
        <Link to="haunted-house">Haunted House</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>This is the home page.</p>
    </div>
  );
}
