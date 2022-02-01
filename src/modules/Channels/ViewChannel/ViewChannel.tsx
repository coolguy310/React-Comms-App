import React from "react";
import Input from "components/forms/Input/Input";
import { useLocation } from "react-router-dom";

export default function ViewChannel() {
  const location = useLocation();

  console.log(location);

  return (
    <div className="pt-2">
      <h1 className="text-4xl font-bold px-12">Channel 1</h1>
      <hr className="mt-8 mb-4" />
      <div className="py-3 px-12 flex space-x-4">
        <img
          src="https://picsum.photos/200"
          alt="user"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-bold text-lg">Tom Holland</p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae culpa
            quas perferendis cupiditate libero accusantium reiciendis cumque,
            voluptatem aliquid eaque ducimus, deserunt officiis facere
            voluptatibus illo commodi tempore nulla consequatur?
          </p>
        </div>
      </div>

      <div className="px-24 pt-8">
        <p className="font-semibold text-md mb-1">Replies</p>
        <hr />
        <div className="py-3 px-2 flex space-x-4">
          <img
            src="https://picsum.photos/200"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-bold">Tom Holland</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae
              culpa quas perferendis cupiditate libero accusantium reiciendis
              cumque, voluptatem aliquid eaque ducimus, deserunt officiis facere
              voluptatibus illo commodi tempore nulla consequatur?
            </p>
          </div>
        </div>

        <div className="py-3 px-2 flex space-x-4">
          <img
            src="https://picsum.photos/200"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <Input placeholder="Write a comment and press enter to send" />
        </div>
      </div>
    </div>
  );
}
