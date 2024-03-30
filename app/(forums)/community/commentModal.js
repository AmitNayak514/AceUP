"use client";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/app/atom/questionsatom";
import Modal from "react-modal";
import { PhotographIcon, XIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase.config";
import Moment from "react-moment";
import { EmojiHappyIcon } from "@heroicons/react/outline";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const CommentModal = () => {
  //   const { data: session } = useSession();
  const { user, isLoading } = useUser();
  console.log(user);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot.data());
    });
  }, [postId, db]);

  async function sendComment() {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: input,
      name: user.fullName,
      username: user.firstName,
      userImg: user.imageUrl,
      timestamp: serverTimestamp(),
      userid: user.id,
    });

    setOpen(false);
    setInput("");
    router.push(`/community/posts/${postId}`);
  }

  return (
    <div>
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        className="max-w-xl w-[90%] h-[300px] absolute top-24 left-[45%] translate-x-[-40%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
      >
        <div className="p-1">
          <div className="border-b border-gray-200 py-2 px-1.5">
            <div className="hoverEffect w-10 h-10 flex items-center justify-center ">
              <XIcon
                onClick={() => setOpen(false)}
                className=" h-[23px] cursor-pointer text-gray-700 p-0"
              />
            </div>
          </div>
          <div className="p-2 flex items-center space-x-1 relative">
            <span className="w-0.5 h-full z-[-1] absolute left-9 top-11 bg-gray-300" />
            <img className="h-12 w-12 rounded-full mr-4" src={post?.img}></img>
            <div className="flex space-x-2 items-center">
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {post?.name}
              </h4>
              <span className="text-gray-600 text-sm sm:text-[15px]">
                @{post?.username}
              </span>
              <span className="text-gray-600 text-sm sm:text-[15px]">
                .<Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </span>
            </div>
          </div>
          <p className=" text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
            {post?.text}
          </p>

          <div className="flex p-3 space-x-1 relative">
            {/* <img
              className="h-12 w-12 rounded-full cursor-pointer hover:brightness-95"
              src={user.imageUrl}
            ></img> */}
            <div className="flex-col w-full divide-y divide-gray-200">
              <div className="">
                <textarea
                  className="w-full border-none focus:ring-0 text-lg focus-visible:outline-none placeholder:text-gray-600 tracking-wide min-h-[50px] text-gray-600"
                  rows="2"
                  placeholder="Comment Your Reply"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>
              </div>
              {/* {selectFiles && (
                <div className="relative">
                  <XIcon
                    onClick={() => setSelectedFiles(null)}
                    className="h-5 text-black absolute"
                  />
                  <img
                    src={selectFiles}
                    className={` ${loading && "animate"}`}
                  ></img>
                </div>
              )} */}
              <div className="flex items-center justify-between pt-1.5">
                <div className="flex">
                  <div>
                    <PhotographIcon className="h-10 w-10 p-2 rounded-full text-[#8854c0] hover:bg-[#8854c0]/30 hoverEffect hover:bg-blue-100" />
                    {/* <input
                      hidden
                      ref={filePickerRef}
                      onChange={addtoPost}
                      type="file"
                    /> */}
                  </div>

                  <EmojiHappyIcon className="h-10 w-10 p-2 rounded-full text-[#8854c0] hover:bg-[#8854c0]/30 hoverEffect hover:bg-blue-100" />
                </div>

                <button
                  onClick={sendComment}
                  disabled={!input.trim()}
                  className="text-white bg-[#8854c0] font-bold rounded-full px-6 py-1.5 shadow-md hover:brightness-150"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommentModal;
