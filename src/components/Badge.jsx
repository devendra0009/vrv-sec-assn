import React from "react";

const Badge = ({ content }) => {
  return (
    <span class="mb-2 inline-flex items-center rounded-md  uppercase text-md bg-black px-4   font-medium text-white ring-1 ring-inset ring-pink-700/10">
      {content}
    </span>
  );
};

export default Badge;
