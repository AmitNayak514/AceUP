"use client";
import React, { useRef } from "react";
import { PhotographIcon, EmojiHappyIcon, XIcon } from "@heroicons/react/solid";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase.config";

import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Input = ({ user }) => {
  //   const { data: session } = useSession();

  // console.log(user);

  const [input, setInput] = useState("");
  const [selectFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: user.id,
      text: input,
      name: user.fullName,
      img: user.imageUrl,
      username: user.firstName,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/images`);

    if (selectFiles) {
      await uploadString(imageRef, selectFiles, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          postimage: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFiles(null);
    setLoading(false);
  };

  const addtoPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFiles(readerEvent.target.result);
    };
  };

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3">
      <img
        className="h-12 mr-2 w-12 rounded-full cursor-pointer hover:brightness-95"
        src={user.imageUrl}
      ></img>
      <div className="flex-col w-full divide-y divide-gray-200">
        <div className="">
          <textarea
            className="w-full border-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none text-lg placeholder:text-gray-600 tracking-wide min-h-[50px] text-gray-600"
            rows="2"
            placeholder="Whats Your Doubt?...."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
        {selectFiles && (
          <div className="relative">
            <XIcon
              onClick={() => setSelectedFiles(null)}
              className="h-5 text-black absolute"
            />
            <img src={selectFiles} className={` ${loading && "animate"}`}></img>
          </div>
        )}
        <div className="flex items-center justify-between pt-1.5">
          <div className="flex">
            <div onClick={() => filePickerRef.current.click()}>
              <PhotographIcon className="h-10 w-10 p-2 rounded-full text-[#8854c0]/90 hoverEffect hover:bg-[#8854c0]/30" />
              <input
                hidden
                ref={filePickerRef}
                onChange={addtoPost}
                type="file"
              />
            </div>

            <EmojiHappyIcon className="h-10 w-10 p-2 rounded-full text-[#8854c0]/90 hoverEffect hover:bg-[#8854c0]/30" />
          </div>

          <button
            onClick={sendPost}
            disabled={!input.trim()}
            className="text-white bg-[#8854c0] hover:brightness-150 font-bold rounded-full mr-10 px-6 py-1.5 shadow-md"
          >
            Post!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
