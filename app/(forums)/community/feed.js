"use client";
import { SparklesIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase.config";
import { AnimatePresence, motion } from "framer-motion";
import Input from "./input";
import Post from "./post";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

const Feed = () => {
  //   const { data: session } = useSession();
  //   const user = session?.user;
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex-grow px-28">
      <div className="mt-8 shadow-xl shadow-black/60 rounded-xl ">
        <div className="flex px-2 py-3 top-0 z-50  sticky">
          <div
            className="text-lg sm:text-xl flex items-center ml-2 font-bold cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <ArrowLeftIcon className="h-8 mt-1 mr-2 hover:bg-gray-200 rounded-full" />
            Dashboard
          </div>
          {/* <div className="hoverEffect px-0 flex items-center justify-center ml-auto w-9 h-9">
          <SparklesIcon className="h-5 " />
        </div> */}
        </div>
        {user && <Input user={user} />}

        {/* post page */}
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Post key={post.id} id={post.id} post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;
