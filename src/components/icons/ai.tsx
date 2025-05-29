import React from "react";

function AI() {
  return (
    <>
      <svg className="absolute -top-[999px] -left-[999px] w-0 h-0">
        <defs>
          <clipPath id="differentone5" clipPathUnits="objectBoundingBox">
            <path
              d="M1 0.5C0.867392 0.5 0.740215 0.447322 0.646447 0.353553C0.552678 0.259785 0.5 0.132608 0.5 0C0.5 0.132608 0.447322 0.259785 0.353553 0.353553C0.259785 0.447322 0.132608 0.5 0 0.5C0.132608 0.5 0.259785 0.552678 0.353553 0.646447C0.447322 0.740215 0.5 0.867392 0.5 1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5Z"
              fill="black"
            />
          </clipPath>
        </defs>
      </svg>

      <figure style={{ clipPath: "url(#differentone5)" }} className="size-48">
        <img
          src="/bg.avif"
          alt="Description"
          className="w-full h-full object-cover"
        />
      </figure>
    </>
  );
}

export default AI;
