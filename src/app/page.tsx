import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

function HomePage() {
  return (
    <main className="flex flex-1">
      <div className="mx-auto container">
        <div className="bg-white/55 shadow-md my-4 py-8 rounded-md text-center">
          <h1 className="bg-clip-text bg-gradient-to-r from-green-500 to-yellow-800 mb-4 font-bold text-4xl text-transparent">
            Welcome to Chat App
          </h1>
          <p className="mb-8 text-lg">
            A group chat platform where you can create chat rooms, invite
            members, and connect with others. Stay tuned for future updates,
            including audio and video chat functionalities.
          </p>
          <div className="mb-8">
            <div className="flex justify-center gap-2 mb-4">
              <img
                src="https://utfs.io/f/b33f1e6f-003a-4955-be08-fab8d1330d2d-zex2pg.png"
                alt="Chat App Rooms"
                className="shadow-lg rounded-lg h-64 transition-transform object-cover hover:scale-105"
              />
              <img
                src="https://utfs.io/f/785856e8-589b-4c08-a0a0-9b3714472c91-18znc.png"
                alt="Chat App Invitations"
                className="shadow-lg ml-4 rounded-lg h-64 transition-transform object-cover hover:scale-105"
              />
            </div>
            <p className="mb-4 text-lg">
              Explore our intuitive interface for creating chat rooms and
              inviting members.
            </p>
          </div>
          <div>
            <SignedIn>
              <Link
                href="/chat"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-bold text-white"
              >
                Start Chatting
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-bold text-white"
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
