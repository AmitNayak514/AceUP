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
import { db, storage } from "@/firebase.config";
// import { signIn, useSession } from "next-auth/react";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/app/atom/questionsatom";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const Post = ({ post, id }) => {
  const router = useRouter();
  //   const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, sethasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot?.docs)
    );
  }, [db]);

  useEffect(() => {
    sethasLiked(likes?.findIndex((like) => like?.id === user?.id) !== -1);
  }, [likes]);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "comments"), (snapshot) =>
      setComments(snapshot.docs)
    );
  }, [db]);

  async function likePost() {
    if (user) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", user?.id));
      } else {
        await setDoc(doc(db, "posts", id, "likes", user?.id), {
          username: user.fullName,
        });
      }
    } else {
      router.push("/sign-in");
    }
  }

  async function deletepost() {
    if (window.confirm("Are you sure you want to delete this post")) {
      deleteDoc(doc(db, "posts", id));
      if (post?.data()?.postimage) {
        deleteObject(ref(storage, `posts/${post?.id}/images`));
      }
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b">
      <img
        className="h-12 w-12 rounded-full mr-4"
        src={post?.data()?.img}
      ></img>

      <div className="">
        <div className="flex justify-between items-center whitespace-nowrap ">
          <div className="flex space-x-2 items-center">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post?.data()?.name}
            </h4>
            <span className="text-gray-600 text-sm sm:text-[15px]">
              @{post?.data()?.username}
            </span>
            <span className="text-gray-600 text-sm sm:text-[15px]">
              .<Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:bg-[#8854c0]/30 rounded-full p-2 text-gray-600" />
        </div>

        <p className="text-gray-800 text-[15px sm:text-[16px] mb-2">
          {post?.data()?.text}
        </p>

        <img
          onClick={() => {
            router.push(`/community/posts/${id}`);
          }}
          className="rounded-2xl mr-2"
          src={post?.data()?.postimage}
        ></img>

        <div className="flex justify-between p-2 text-gray-500">
          <div className="flex items-center">
            <ChatIcon
              onClick={() => {
                setPostId(id);
                setOpen(!open);
              }}
              className="h-9 w-9 hoverEffect rounded-full hover:bg-[#8854c0]/30 p-2"
            />

            {comments.length > 0 && <span>{comments.length}</span>}
          </div>
          {user?.id == post?.data()?.id && (
            <TrashIcon
              onClick={deletepost}
              className="h-9 w-9 hoverEffect rounded-full hover:bg-[#8854c0]/30 p-2"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <Heart
                onClick={likePost}
                className="h-9 w-9 hoverEffect rounded-full text-red-600 p-2"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 hoverEffect rounded-full hover:bg-red-200 p-2"
              />
            )}

            {likes?.length > 0 && <span>{likes?.length}</span>}
          </div>

          {/* <ShareIcon className="h-9  w-9 hoverEffect rounded-full hover:bg-blue-200 p-2" />
          <ChartBarIcon className="h-9 w-9 hoverEffect rounded-full hover:bg-blue-200 p-2" /> */}
        </div>
      </div>
    </div>
  );
};

export default Post;
