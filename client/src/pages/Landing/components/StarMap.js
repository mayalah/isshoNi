import React, { useState, useEffect } from "react";
import SparkleSvg from "../../../assets/sparkle.svg"; // Import your SparkleSvg component

const StarMap = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 60 }, (_, index) => {
      const left = Math.floor(Math.random() * window.innerWidth);
      const top = Math.floor(Math.random() * window.innerHeight);
      const size = Math.floor(Math.random() * 10) + 10;
      return { id: index + 1, left, top, size, visible: true };
    });

    setStars(newStars);

    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          visible:
            star.id % 2 !== 0 || (star.id % 2 === 0 && Math.random() > 0.5),
        }))
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh" }}>
      {stars.map(
        (star) =>
          star.visible && (
            <img
              key={star.id}
              src={SparkleSvg}
              alt="Star"
              style={{
                position: "absolute",
                left: `${star.left}px`,
                top: `${star.top}px`,
                height: `${star.size}px`,
                width: `${star.size}px`,
                zIndex: 0,
              }}
            />
          )
      )}
    </div>
  );
};

export default StarMap;
