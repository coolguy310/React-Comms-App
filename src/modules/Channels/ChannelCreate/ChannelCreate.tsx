/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Input from "components/forms/Input/Input";
import Modal from "components/ui/Modal/Modal";
import { IoAdd } from "react-icons/io5";
import db from "../../../firebase";
import { Firestore, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Box from "components/ui/Box/Box";
import Text from "components/ui/Text/Text";
import { getAuth } from "firebase/auth";
import { nanoid } from "nanoid";
import { useRegisterActions } from "kbar";
import Flex from "components/ui/Flex/Flex";
import { MdInfo } from "react-icons/md";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

const initialChannelDetails = {
  name: "",
  description: "",
  invitees: "",
  classification: "public",
};

export default function ChannelCreate() {
  const [channelDetails, setChannelDetails] = useState(initialChannelDetails);
  const [isOpen, setIsOpen] = useState(false);

  const { name, description, invitees, classification } = channelDetails;

  useEffect(() => {
    function handleCtrlEnter(event: any) {
      if (
        event.ctrlKey &&
        event.key === "Enter" &&
        event.defaultPrevented === false
      ) {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", handleCtrlEnter, true);
    return () => window.removeEventListener("keydown", handleCtrlEnter, true);
  }, [channelDetails]);

  const handleChange = (name: string, value: any) => {
    setChannelDetails({
      ...channelDetails,
      [name]: value,
    });
  };

  const auth = getAuth();
  let navigate = useNavigate();

  const onClose = () => {
    setIsOpen(false);
    setChannelDetails(initialChannelDetails);
  };

  const handleSubmit = async () => {
    if (!name) return;

    const payload = {
      id: nanoid(),
      creatorId: auth!.currentUser?.uid,
      name,
      description,
      invitees,
      classification,
      createdAt: new Date().toISOString(),
    };

    // Add to channel collection
    await setDoc(doc(db as Firestore, "channels", payload.id), payload);

    // Then route to the newly created channel
    navigate(`/${payload.id}`);

    // Close modal and reset channel name
    onClose();
  };

  // Register hotkey for opening create channel modal
  useRegisterActions([
    {
      id: "open-channel-modal",
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
        <Box css={{ width: "30rem" }}>
          <Text as="h4" fontSize="xl" fontWeight="bold">
            Create Channel
          </Text>
          <Box as="form" action="submit" css={{ marginTop: "1rem" }}>
            <Box css={{ marginBottom: 16 }}>
              <Text
                css={{
                  marginBottom: 8,
                  width: "8rem",
                  flexShrink: 0,
                  marginRight: 16,
                }}
                as="label"
                htmlFor="name"
              >
                Channel name *
              </Text>
              <Input
                id="name"
                required
                value={name}
                css={{
                  border: 0,
                  borderBottom: "1px solid lightgray",
                  padding: "0",
                  fontSize: 20,
                }}
                placeholder="My Awesome Channel"
                onChange={(event) => handleChange("name", event.target.value)}
              />
            </Box>
            <Box css={{ marginBottom: 16 }}>
              <Text
                css={{
                  marginBottom: 8,
                  width: "8rem",
                  flexShrink: 0,
                  marginRight: 16,
                }}
                as="label"
                htmlFor="description"
              >
                Description
              </Text>
              <Input
                id="description"
                required
                css={{
                  height: "2rem",
                  border: 0,
                  borderBottom: "1px solid lightgray",
                  padding: "0",
                }}
                placeholder="Short description of the channel"
                value={description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
              />
            </Box>
            <Box css={{ marginBottom: 16 }}>
              <Text
                css={{
                  marginBottom: 8,
                  width: "8rem",
                  flexShrink: 0,
                  marginRight: 16,
                }}
                as="label"
                htmlFor="invitees"
              >
                Invite to Channel
              </Text>
              <Input
                id="invitees"
                required
                css={{
                  height: "2.5rem",
                  border: 0,
                  borderBottom: "1px solid lightgray",
                  padding: "0",
                }}
                placeholder="Invite people to your channel"
                value={invitees}
                onChange={(event) =>
                  handleChange("invitees", event.target.value)
                }
              />
            </Box>
            <Flex alignCenter css={{ marginBottom: 16 }}>
              <Text
                css={{
                  width: "8rem",
                  flexShrink: 0,
                  marginRight: 16,
                }}
                as="label"
                htmlFor="classification"
              >
                Classification:
              </Text>
              <Flex>
                <Flex alignCenter css={{ marginRight: 30 }}>
                  <Box
                    as="input"
                    css={{ marginRight: 8 }}
                    type="radio"
                    name="classification"
                    id="public"
                    value="public"
                    checked={classification === "public"}
                    onChange={() => handleChange("classification", "public")}
                  />
                  <label htmlFor="public">Public</label>
                  &nbsp;
                  <Tooltip title="Anyone at your organization can find and join">
                    <MdInfo color="gray" />
                  </Tooltip>
                </Flex>

                <Flex alignCenter>
                  <Box
                    as="input"
                    css={{ marginRight: 8 }}
                    type="radio"
                    name="classification"
                    id="private"
                    value="private"
                    checked={classification === "private"}
                    onChange={() => handleChange("classification", "private")}
                  />
                  <label htmlFor="private">Private</label>
                  &nbsp;
                  <Tooltip title="Only the people you have invited can join">
                    <MdInfo color="gray" />
                  </Tooltip>
                </Flex>
              </Flex>
            </Flex>
            <Flex justifyEnd alignCenter css={{ marginTop: 24 }}>
              <Box css={{ padding: "0.5rem 1rem" }} as="kbd">
                CTRL
              </Box>
              <Box
                as="kbd"
                css={{ margin: "0 0.75rem", padding: "0.5rem 1rem" }}
              >
                ENTER
              </Box>
              <Text>to create</Text>
            </Flex>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
