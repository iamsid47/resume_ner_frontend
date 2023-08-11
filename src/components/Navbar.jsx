import React from "react";

const Navbar = () => {
  return (
    <nav class="bg-gray-800">
      <div class="max-w-screen-xl flex flex-wrap items-start justify-start mx-auto p-4">
        <a href="/" class="flex items-center">
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">
            SkillMatcher
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
