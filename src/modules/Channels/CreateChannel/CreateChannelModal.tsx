import Input from "components/forms/Input/Input";
import Modal from "components/ui/Modal/Modal";
import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import db from "../../../firebase";
import { Firestore, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Box from "components/ui/Box/Box";
import Text from "components/ui/Text/Text";
import Button from "components/ui/Button/Button";
import { getAuth } from "firebase/auth";
import { nanoid } from "nanoid";
import { useRegisterActions } from "kbar";

export default function CreateChannelModal() {
  const [channelName, setChannelName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const auth = getAuth();
  let navigate = useNavigate();

  const onClose = () => setIsOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: nanoid(),
      creatorId: auth!.currentUser?.uid,
      name: channelName,
      createdAt: new Date().toISOString(),
    };

    // Add to channel collection
    await setDoc(doc(db as Firestore, "channels", payload.id), payload);

    // Then route to the newly created channel
    navigate(`/${payload.id}`);

    // Close modal and reset channel name
    onClose();
    setChannelName("");
  };

  // Register hotkey for opening create channel modal
  useRegisterActions([
    {
      id: "new-channel",
      name: "Create a new channel",
      section: "Channels",
      shortcut: ["n", "c"],
      keywords: "channel new",
      perform: () => setIsOpen(true),
    },
  ]);

  return (
    <div>
      <Box
        as="button"
        onClick={() => setIsOpen(true)}
        css={{
          padding: 4,
          borderRadius: 6,
          "&:hover": { backgroundColor: "$gray2" },
        }}
      >
        <IoAdd />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <Box css={{ width: "24rem" }}>
          <Text as="h4" fontSize="lg" fontWeight="bold">
            Create Channel
          </Text>
          <Box as="form" css={{ marginTop: "1rem" }} onSubmit={handleSubmit}>
            <Box>
              <Text css={{ marginBottom: 8 }} as="label" htmlFor="name">
                Channel name
              </Text>
              <Input
                id="name"
                required
                value={channelName}
                onChange={(event) => setChannelName(event.target.value)}
              />
            </Box>
            <Box css={{ display: "flex", marginTop: 24 }}>
              <Button
                type="button"
                onClick={onClose}
                variant="bordered"
                css={{ marginRight: "1rem", width: "10rem", height: "3rem" }}
                className="h-12 rounded-md w-40"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                css={{ width: "100%", height: "3rem" }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
