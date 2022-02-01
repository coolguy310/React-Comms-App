import Input from "components/forms/Input/Input";
import Modal from "components/ui/Modal/Modal";
import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import db from "../../../firebase";
import { Firestore, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateChannelModal() {
  const [channelName, setChannelName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  let navigate = useNavigate();

  const onClose = () => setIsOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = await addDoc(collection(db as Firestore, "channels"), {
      name: channelName,
      createdAt: new Date(),
    });

    navigate(`/${data.id}`);

    onClose();
    setChannelName("");
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 rounded-md hover:bg-gray-100 transition-all"
      >
        <IoAdd />
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-96">
          <h4 className="font-bold text-lg">Create Channel</h4>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-2">
              <label htmlFor="name">Channel name</label>
              <Input
                required
                value={channelName}
                onChange={(event) => setChannelName(event.target.value)}
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-md border border-gray-400 w-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-12 rounded-md text-white bg-primary w-full"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
