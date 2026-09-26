import { auth, signOut } from "@/lib/auth";
import { AppHeader } from "@/components/layout/app-header";

export async function SiteHeader() {
  const session = await auth();

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <AppHeader
      isLoggedIn={!!session?.user}
      isAdmin={session?.user?.role === "ADMIN"}
      logoutAction={logoutAction}
    />
  );
}
