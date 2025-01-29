import { Avatar } from "@mui/material";
import React from "react";

const colors = [
  "#2E3B55", // Dark Blue
  "#4A4A4A", // Dark Gray
  "#3B3F40", // Dark Charcoal
  "#8B4513", // Saddle Brown
  "#2F4F4F", // Dark Slate Gray
  "#483D8B", // Dark Slate Blue
  "#8B0000", // Dark Red
  "#556B2F", // Dark Olive Green
  "#800000", // Maroon
  "#2C3E50", // Midnight Blue
  "#3B5323", // Army Green
  "#4B0082", // Indigo
];

// Function to select color based on the first letter of the name
const getColorByLetter = (name) => {
  if (!name) return colors[0]; // Default to the first color if no name
  const firstLetter = name[0].toUpperCase();
  const index = firstLetter.charCodeAt(0) % colors.length;
  return colors[index];
};

const UserProfile = ({ name, url, size, fontSize }) => {
  return (
    <>
      {url ? (
        <Avatar
          sx={{
            bgcolor: getColorByLetter(name),
            width: size,
            height: size,
            fontSize,
          }}
          variant="rounded"
          src={url}
        />
      ) : (
        <Avatar
          sx={{
            bgcolor: getColorByLetter(name),
            width: size,
            height: size,
            fontSize,
          }}
          variant="rounded"
        >
          {name?.substring(0, 1)?.toUpperCase()}
        </Avatar>
      )}
    </>
  );
};

export default UserProfile;
