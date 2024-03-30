import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { UserButton } from "@clerk/nextjs";
const CommunityLayout = async ({ children }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:w-72 md:flex md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar />
      </div>
      <div className="absolute top-0 right-0 m-4">{/* <UserButton /> */}</div>
      <main className="md:pl-72">
        <div className="md:hidden">
          <Navbar />
        </div>
        {children}
      </main>
    </div>
  );
};

export default CommunityLayout;
