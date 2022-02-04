import React from "react";
import { styled } from "stitches.config";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Avatar = (props: AvatarProps) => {
  return <img alt={props.alt} referrerPolicy="no-referrer" {...props} />;
};

const StyledAvatar = styled(Avatar, {
  width: "2rem",
  height: "2rem",
  borderRadius: "9999px",
});

export default StyledAvatar;
