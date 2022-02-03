import React, { useEffect, useState } from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Button from "components/ui/Button/Button";
import Text from "components/ui/Text/Text";
import { Table, Tbody, Td, Tr, InboxText } from "./Inbox.styled";
import { IPost } from "utils/types";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import db from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { sortByDate } from "../../utils/helpers";

export default function Inbox() {
  const [inbox, setInbox] = useState<IPost[]>([]);
  const [triaged, setTriaged] = useState<string[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const auth = getAuth();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch channel posts
    let unsub;

    // make sure triages are fetched before getting inbox
    if (triaged.length) {
      unsub = onSnapshot(
        // fetch posts whose triageIds are not contained in the array of triaged posts
        query(collection(db, "posts"), where("triageId", "not-in", triaged)),
        ({ docs }) => {
          // Then filter posts that belong to the logged in user, (you wouldnt want to see your posts in your video)
          const currentInbox = docs.filter(
            (doc) => doc.data().authorId !== auth.currentUser!.uid
          );

          // If currentInbox is empty, setIsEmpty to true
          setIsEmpty(!currentInbox.length);
          setInbox(
            currentInbox.map((doc) => ({
              ...(doc.data() as Omit<IPost, "id">),
              id: doc.id,
            }))
          );
        }
      );
    }

    return unsub;
  }, [auth.currentUser, triaged]);

  useEffect(() => {
    const unsub = onSnapshot(
      // Listen for, and fetch triaged posts
      query(collection(db, "users", auth.currentUser!.uid, "triaged")),
      (snapshot) => {
        setTriaged(["", ...snapshot.docs.map((doc) => doc.id)]);
      }
    );

    return unsub;
  }, [auth.currentUser]);

  const triagePost = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    post: IPost
  ) => {
    event.stopPropagation();

    // Add post to collection of triaged posts
    await setDoc(
      doc(db, "users", auth.currentUser!.uid, "triaged", post.triageId),
      post
    );
  };

  const openInboxPost = async (post: IPost) => {
    // Route to post's channel
    navigate(`/${post.channelId}`);
  };

  const sortedInbox = sortByDate(inbox); // Sort by date in ascending order

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
        <Table as="table">
          <Tbody>
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
                <Tr onClick={() => openInboxPost(post)} key={id}>
                  <Td className="author">
                    <Box css={{ display: "flex" }}>
                      <Avatar css={{ marginRight: "1rem" }} src={authorImage} />
                      <Box>
                        <Text
                          fontSize="md"
                          fontWeight="bold"
                          css={{ marginRight: 8 }}
                        >
                          {authorName}
                        </Text>
                        <Text fontSize="xs">
                          at {new Date(createdAt?.toDate()).toLocaleString()}
                        </Text>
                      </Box>
                    </Box>
                  </Td>
                  <Td>
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        css={{
                          color: "$gray9",
                          textTransform: "uppercase",
                        }}
                      >
                        {channelName}
                      </Text>
                      <InboxText>{text}</InboxText>
                    </Box>
                  </Td>
                  <Td className="actions">
                    <Button
                      variant="bordered"
                      css={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "$gray3",
                        fontSize: "small",
                      }}
                      onClick={(event) => triagePost(event, post)}
                    >
                      Mark as done
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
