import React, { useMemo } from "react";
import "./ComingSoon.css";
function ComingSoon() {
  const [loadingText, setLoadingText] = React.useState("");

  const phrases = [
    "Unifying the quantum flux capacitor",
    "Initializing the crystal harmonizer",
    "Synchronizing the resonance frequency",
    "Tuning the interdimensional coil",
    "Configuring the transdimensional gateway",
    "Encoding the temporal frequency",
    "Bootstrapping the chronal accelerator",
    "Activating the sentient AI",
    "Rebooting the reality core",
    "Aligning the event horizon",
    "Transcending the space-time continuum",
    "Accessing the collective unconscious",
    "Cracking the code of the cosmos",
    "Embracing the infinite possibilities",
    "Tapping into the cosmic energy",
    "Unlocking the secrets of the universe",
    "Discovering the hidden patterns",
    "Unraveling the mysteries of existence",
    "Awakening to the infinite potential",
    "Transmuting the lead of ignorance",
    "Transforming the dross of confusion",
    "Illuminating the darkness of the void",
    "Embodying the infinite wisdom",
    "Experiencing the eternal bliss",
    "Becoming one with the universe",
  ];

  useMemo(() => {
    setLoadingText(phrases[Math.floor(Math.random() * phrases.length)]);
    const interval = setInterval(() => {
      setLoadingText(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {" "}
      <div className="flex h-screen w-screen items-center justify-center badge">
        <p className="text-4xl font-bold mt-4 text-text-800 z-20">
          {loadingText}
        </p>
      </div>
      <div className="h-screen top-0 left-0 w-screen absolute flex flex-row flex-wrap justify-around bg-background-50">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="loader "
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <button
        className="h-screen top-0 left-0 w-screen absolute "
        onClick={() => window.history.back()}
      ></button>
    </>
  );
}

export default ComingSoon;
