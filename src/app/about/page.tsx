import React from "react";
import { Github, Linkedin } from "lucide-react";

function AboutPage() {
  return (
    <main className="flex flex-1">
      <div className="px-4 py-8 container">
        <div className="bg-white shadow-md p-6 rounded-md">
          <h1 className="mb-4 font-bold text-3xl text-center">
            About Chat App
          </h1>
          <p className="mb-4 text-lg">
            Chat App is a group chat platform where you can create chat rooms,
            invite members, and connect with others. This project aims to
            provide an easy-to-use interface for managing group communications.
            Future updates will include audio and video chat functionalities.
          </p>
          <div className="py-4">
            <h3 className="mb-2 font-semibold text-xl">Connect with me</h3>
            <ul className="flex justify-center gap-4 list-none">
              <li>
                <a
                  href="https://github.com/DimRev"
                  target="_blank"
                  aria-label="GitHub"
                >
                  <Github className="w-8 h-8 text-blue-500 hover:text-blue-700" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/dimrev"
                  target="_blank"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-8 h-8 text-blue-500 hover:text-blue-700" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
