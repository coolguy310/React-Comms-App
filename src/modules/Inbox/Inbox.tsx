import React, { useEffect, useState } from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Button from "components/ui/Button/Button";
import Text from "components/ui/Text/Text";
import { InboxText, InboxList } from "./Inbox.styled";
import { IPost } from "utils/types";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import db from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { sortByDate, sortMentionsToTop } from "../../utils/helpers";
import Flex from "components/ui/Flex/Flex";

export default function Inbox() {
  const [inbox, setInbox] = useState<IPost[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const auth = getAuth();
  let navigate = useNavigate();

  useEffect(() => {
    // fetch inbox by user uid
    const unsub = onSnapshot(
      collection(db, "users", auth.currentUser!.uid, "inbox"),
      ({ docs }) => {
        setIsEmpty(!docs.length);
        setInbox(
          docs.map((doc) => ({
            ...(doc.data() as IPost),
          }))
        );
      }
    );

    return unsub;
  }, [auth.currentUser]);

  const markAsDone = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    post: IPost
  ) => {
    event.stopPropagation();

    // Remove post from inbox
    await deleteDoc(doc(db, "users", auth.currentUser!.uid, "inbox", post.id));
  };

  const openInboxPost = async (post: IPost) => {
    // Route to post's channel
    navigate(`/${post.channelId}`);
  };

  let sortedInbox = sortByDate(inbox); // Sort by date in ascending order

  sortedInbox = sortMentionsToTop(sortedInbox, auth.currentUser!.uid); // Sort to show mentions on top

  return (
    <Box css={{ paddingTop: 8 }}>
      <Text as="h1" fontWeight="bold" css={{ padding: "0 3rem", fontSize: 36 }}>
        Inbox
      </Text>
      <Box as="hr" css={{ marginTop: "2rem" }} />

      <Box>
        {isEmpty && (
          <Text css={{ textAlign: "center", marginTop: 20 }}>
            You have reached Inbox 0 🎉
          </Text>
        )}

        <InboxList>
          {sortedInbox.map((post) => {
            const {
              id,
              authorImage,
              authorName,
              channelName,
              text,
              createdAt,
            } = post;
            return (
              <Flex
                justifyBetween
                css={{ padding: "0.5rem 2rem", cursor: "pointer" }}
                onClick={() => openInboxPost(post)}
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
                <Box css={{ width: "100%", maxWidth: "calc(100% - 31rem)" }}>
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
                <Flex alignEnd css={{ width: "100%", maxWidth: "16rem" }}>
                  <Button
                    variant="bordered"
                    css={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "$gray3",
                      fontSize: "small",
                    }}
                    onClick={(event) => markAsDone(event, post)}
                  >
                    Mark as done
                  </Button>
                  {text.includes(`@@${auth.currentUser!.displayName}`) && (
                    // If text contains an @@ with the logged in user, display the response requested badge
                    <Button
                      css={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "$red9",
                        fontSize: "small",
                        color: "white",
                        marginLeft: 8,
                      }}
                    >
                      Response Requested
                    </Button>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </InboxList>
      </Box>
    </Box>
  );
}
