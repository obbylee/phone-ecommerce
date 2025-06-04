import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Route() {
  return (
    <section className="py-10 w-full">
      <div className="w-full bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200">
        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-lg">Your dashboard awaits. Let's get things done.</p>
      </div>
    </section>
  );
}
