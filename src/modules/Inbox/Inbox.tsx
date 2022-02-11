import React from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Button from "components/ui/Button/Button";
import Text from "components/ui/Text/Text";
import { InboxText, InboxItem } from "./Inbox.styled";
import { IPost } from "utils/types";
import { deleteDoc, doc } from "firebase/firestore";
import db from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { sortByDate, sortMentionsToTop } from "../../utils/helpers";
import Flex from "components/ui/Flex/Flex";
import { useAppContext } from "utils/Context/Context";
import { useInboxHotkeys } from "utils/Hotkeys/inboxHotkeys";
import useArrowNavigation from "utils/Hooks/useArrowNavigation";

export default function Inbox() {
  const { activeSection, inbox } = useAppContext();

  const auth = getAuth();
  let navigate = useNavigate();

  const isActive = activeSection === "inbox";

  const markAsDone = async (
    post: IPost,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event?.stopPropagation();

    // Remove post from inbox
    await deleteDoc(doc(db, "users", auth.currentUser!.uid, "inbox", post.id));
  };

  const openInboxPost = async (post: IPost) => {
    // Route to post's channel
    navigate(`/${post.channelId}`);
  };

  const { cursor, setHovered, setSelected } = useArrowNavigation(
    isActive,
    inbox,
    openInboxPost
  );

  useInboxHotkeys({ post: inbox && inbox[cursor], markAsDone });

  if (!inbox) return null;

  let sortedInbox = sortByDate(inbox); // Sort by date in ascending order

  sortedInbox = sortMentionsToTop(sortedInbox, auth.currentUser!.uid); // Sort to show mentions on top

  return (
    <Box css={{ paddingTop: 8 }}>
      <Text as="h1" fontWeight="bold" css={{ padding: "0 3rem", fontSize: 36 }}>
        Inbox
      </Text>

      <Box as="hr" css={{ marginTop: "2rem" }} />

      <Box>
        {!inbox?.length && (
          <Text css={{ textAlign: "center", marginTop: 20 }}>
            You have reached Inbox 0 🎉
          </Text>
        )}

        {sortedInbox.map((post, i) => {
          const { id, authorImage, authorName, channelName, text, createdAt } =
            post;
          return (
            <InboxItem
              className={`item ${isActive && i === cursor ? "active" : ""}`}
              onClick={() => {
                setSelected(post);
                openInboxPost(post);
              }}
              onMouseEnter={() => setHovered(post)}
              onMouseLeave={() => setHovered(undefined)}
              key={id}
            >
              <Flex css={{ width: "100%", maxWidth: "14rem" }}>
                <Avatar css={{ marginRight: "1rem" }} src={authorImage} />
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    css={{ marginRight: 8, marginBottom: 4 }}
                  >
                    {authorName}
                  </Text>
                  <Text fontSize="xs">
                    at {new Date(createdAt?.toDate()).toLocaleString()}
                  </Text>
                </Box>
              </Flex>
              <Box css={{ width: "100%", maxWidth: "calc(100% - 35rem)" }}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  css={{
                    color: "$gray9",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {channelName}
                </Text>
                <InboxText
                  dangerouslySetInnerHTML={{
                    __html: `<div>${text}</div>`,
                  }}
                />
              </Box>
              <Flex alignEnd css={{ width: "100%", maxWidth: "20rem" }}>
                <Button
                  variant="bordered"
                  css={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "$gray3",
                    fontSize: "small",
                  }}
                  onClick={(event) => markAsDone(post, event)}
                >
                  Mark as done
                </Button>
                {text.includes(`@@${auth.currentUser!.displayName}`) && (
                  // If text contains an @@ with the name of the logged in user, display the response requested badge
                  <Button
                    css={{
                      padding: "0.55rem 0.5rem",
                      width: 200,
                      backgroundColor: "$red11",
                      fontSize: "small",
                      color: "white",
                      marginLeft: 8,
                    }}
                  >
                    Response Requested
                  </Button>
                )}
              </Flex>
            </InboxItem>
          );
        })}
      </Box>
    </Box>
  );
}
