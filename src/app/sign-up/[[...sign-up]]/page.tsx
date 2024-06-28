import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-1 justify-center items-center">
      <SignUp />
    </main>
  );
}
