"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    redirect("/login");
  }

  const user = session.user!;

  return (
    <Container className="max-w-md">
      <h1 className="text-2xl font-semibold mb-6">
        My Profile
      </h1>

      <Card className="flex flex-col items-center text-center p-6">
        {user.image && (
          <img
            src={user.image}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
        )}

        <h2 className="text-lg font-medium">
          {user.name}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {user.email}
        </p>

        <div className="text-xs text-gray-400 mb-6">
          Signed in with Google
        </div>

        <Button
          variant="secondary"
          onClick={() => signOut()}
        >
          Logout
        </Button>
      </Card>
    </Container>
  );
}
