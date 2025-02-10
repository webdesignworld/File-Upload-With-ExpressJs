
"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const Navbar = () => {

  const [showModal, setShowModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/shadcn.png");


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);


  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("about", about);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      const response = await fetch("http://localhost:5000/coders/profile", {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Profile updated successfully:", data);
 
      if (data.avatar) {
        setAvatarUrl(data.avatar);
      }
      alert("Profile updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between">
        <Button className="bg-[#23155b] dark:bg-white">
          <Link href="/challenge-form">Challenges</Link>
        </Button>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage
                  src={avatarUrl}
                  width={40}
                  className="rounded-full"
                  alt="User Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowModal(true)}>
                Update Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/auth/signin">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

 
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Update Profile
            </h2>
            <form onSubmit={handleProfileSubmit} encType="multipart/form-data">
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-black dark:text-white">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-black dark:text-white">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="about" className="block text-black dark:text-white">
                  About
                </label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="avatar" className="block text-black dark:text-white">
                  Avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="w-full"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
