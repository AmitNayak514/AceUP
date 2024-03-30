"use client";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { HeartIcon as Heart } from "@heroicons/react/solid";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
// import { signIn, useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/app/atom/questionsatom";
import { db } from "@/firebase.config";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Comments = ({ commentid, comment, originalPostId }) => {
  const { user, isLoading } = useUser();
  const [likes, setLikes] = useState([]);
  const [hasLiked, sethasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();
  useEffect(() => {
    onSnapshot(
      collection(db, "posts", originalPostId, "comments"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, originalPostId, commentid]);

  useEffect(() => {
    sethasLiked(likes.findIndex((like) => like.id === user?.id) !== -1);
  }, [likes]);

  async function likeComment() {
    if (user) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentid,
            "likes",
            user.id
          )
        );
      } else {
        await setDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentid,
            "likes",
            user.id
          ),
          {
            username: user.firstName,
          }
        );
      }
    } else {
      router.push("/sign-in");
    }
  }

  async function deleteComment() {
    if (window.confirm("Are you sure you want to delete this comment")) {
      deleteDoc(doc(db, "posts", originalPostId, "comments", commentid));
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 ">
      <img
        className="h-12 w-12 rounded-full mr-4 ml-16"
        src={comment?.userImg}
      ></img>

      <div className="">
        <div className="flex justify-between items-center whitespace-nowrap ">
          <div className="flex space-x-2 items-center">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {comment?.name}
            </h4>
            <span className="text-gray-600 text-sm sm:text-[15px]">
              @{comment?.username}
            </span>
            <span className="text-gray-600 text-sm sm:text-[15px]">
              .<Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>
        </div>

        <p className="text-gray-800 text-[15px sm:text-[16px] mb-2">
          {comment?.comment}
        </p>

        <div className="flex justify-between p-2 text-gray-500">
          <div className="flex items-center">
            <ChatIcon
              onClick={() => {
                setPostId(originalPostId);
                setOpen(!open);
              }}
              className="h-9 w-9 hoverEffect rounded-full hover:bg-[#8854c0]/30 p-2"
            />
          </div>
          {user?.id == comment?.userid && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect rounded-full hover:bg-[#8854c0]/30 p-2"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <Heart
                onClick={likeComment}
                className="h-9 w-9 hoverEffect rounded-full  text-red-600 p-2"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
                className="h-9 w-9 hoverEffect rounded-full hover:bg-red-200 p-2"
              />
            )}

            {likes.length > 0 && <span>{likes.length}</span>}
          </div>

          {/* <ShareIcon className="h-9  w-9 hoverEffect rounded-full hover:bg-blue-200 p-2" />
          <ChartBarIcon className="h-9 w-9 hoverEffect rounded-full hover:bg-blue-200 p-2" /> */}
        </div>
      </div>
    </div>
  );
};

export default Comments;
