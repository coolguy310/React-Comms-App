/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Input from "components/forms/Input/Input";
import Box from "components/ui/Box/Box";
import Flex from "components/ui/Flex/Flex";
import Modal from "components/ui/Modal/Modal";
import Text from "components/ui/Text/Text";
import { IoMdClose } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { MdInfo } from "react-icons/md";
import ReactTags from "react-tag-autocomplete";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import useChannelCreateHook from "./useChannelCreateHook";

export default function ChannelCreate() {
  const {
    name,
    description,
    classification,
    invitees,
    users,
    channels,
    onTagAddition,
    onTagDelete,
    handleChange,
    isOpen,
    setIsOpen,
    onClose,
    tagPrefix,
  } = useChannelCreateHook();

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

              <ReactTags
                placeholderText="Invite people to your channel"
                tags={invitees}
                suggestions={[...users, ...channels]}
                onDelete={onTagDelete}
                onAddition={onTagAddition}
                tagComponent={({ tag, onDelete }: any) => {
                  return (
                    <Box
                      css={{
                        display: "inline-flex",
                        background: "$gray3",
                        border: "1px solid lightgray",
                        padding: "0.25rem 0.5rem 0.25rem 0.75rem",
                        marginRight: 8,
                        borderRadius: 6,
                        alignItems: "center",
                      }}
                    >
                      {tagPrefix(tag.photoURL)}
                      <Text css={{ marginRight: 4 }}>&nbsp; {tag.name}</Text>
                      <Flex as="button" onClick={onDelete}>
                        <IoMdClose />
                      </Flex>
                    </Box>
                  );
                }}
                minQueryLength={1}
                suggestionComponent={({ item }: any) => {
                  return (
                    <Flex alignCenter>
                      {tagPrefix(item.photoURL)}
                      <Text css={{ flexShrink: 0 }}>&nbsp;{item.name}</Text>
                    </Flex>
                  );
                }}
              />

              <Box as="hr" />
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
                ⌘
              </Box>
              <Box
                as="kbd"
                css={{ margin: "0 0.75rem", padding: "0.5rem 1rem" }}
              >
                RETURN
              </Box>
              <Text>to create</Text>
            </Flex>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
