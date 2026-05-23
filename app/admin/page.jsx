"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {

  const router = useRouter();
  const bottomRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  const [editingMessage, setEditingMessage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  const [deliveryDays, setDeliveryDays] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messageUsers, setMessageUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] =
    useState(0);


  const [selectedProject, setSelectedProject] =
    useState(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);
    const [contextMenu, setContextMenu] =
  useState(null);

  /*
  ========================================
  LOAD ADMIN
  ========================================
  */

  useEffect(() => {

  async function loadAdmin() {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {

      router.push("/admin-login");
      return;

    }

    if (
      session.user.email !==
      "sulaimonganiyu315@gmail.com"
    ) {

      router.push("/");
      return;

    }

    setUser(session.user);

    // LOAD UNREAD MESSAGES
    const { count } = await supabase
      .from("messages")
      .select("*", {
        count: "exact",
        head: true,
      })
    .eq("sender", "client")
    .eq("is_read", false);

    setUnreadMessages(count || 0);

    // LOAD PROJECTS
    const { data: projectsData, error } =
      await supabase
        .from("project_requests")
        .select("*");

    if (projectsData) {

      setProjects(projectsData);

      const uniqueUsers = [
        ...new Set(
          projectsData.map((p) => p.user_id)
        ),
      ];

      setUsersCount(uniqueUsers.length);

      const { data: messagesUsersData } = await supabase
        .from("messages")
        .select("user_email, created_at")
        .eq("sender", "client")
        .order("created_at", { ascending: false });

      if (messagesUsersData) {
        const uniqueMessageUsers = [
          ...new Map(
            messagesUsersData.map((msg) => [
              msg.user_email,
              {
                id: msg.user_email,
                user_id: msg.user_email,
                email: msg.user_email,
                fullname:
                projects.find((p) => p.email === msg.user_email)?.fullname ||
                projects.find((p) => p.email === msg.user_email)?.full_name ||
                msg.user_email?.split("@")[0],
                service: "General Message",
              },
            ])
          ).values(),
        ];

        setMessageUsers(uniqueMessageUsers);
      }

    }

    setLoading(false);

    }

    loadAdmin();

    /*
    ========================================
    REALTIME
    ========================================
    */

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {

          const newMessage = payload.new;

          setMessages((prev) => {

            /*
            PREVENT DUPLICATES
            */

            const exists = prev.some(
              (msg) => msg.id === newMessage.id
            );

            if (exists) return prev;

                        /*
            ONLY APPEND MESSAGE
            IF IT BELONGS TO
            CURRENT OPEN CHAT
            */

              if (!selectedProject) {

                return prev;

              }

              if (
                newMessage.user_email !==
                selectedProject.email
              ) {

                return prev;

              }

            return [
              ...prev,
              newMessage,
            ];

          });

          /*
          UNREAD COUNTER
          */

          if (
            newMessage.sender === "client"
          ) {

            setUnreadMessages(
              (prev) => prev + 1
            );

          }

        }
      )
      .subscribe();

    return () => {

      supabase.removeChannel(channel);

    };

  }, [selectedProject]);

  function canModifyMessage(msg) {
  const createdAt = new Date(msg.created_at);
  const now = new Date();
  const hoursPassed = (now - createdAt) / (1000 * 60 * 60);

  return hoursPassed <= 24;
}

async function handleEditMessage(msg) {
  if (!canModifyMessage(msg)) {
    alert("You can only edit messages within 24 hours.");
    return;
  }

  setEditingMessage(msg);
  setMessage(msg.message);
}

async function handleDeleteMessage(msg) {
  if (!canModifyMessage(msg)) {
    alert("You can only delete messages within 24 hours.");
    return;
  }

  const confirmDelete = confirm("Delete this message?");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("messages")
    .update({
      deleted: true,
      message: "This message was deleted",
    })
    .eq("id", msg.id);

if (!error) {
  setMessages((prev) =>
    prev.filter((item) => item.id !== msg.id)
  );
}
}

function handleReplyMessage(msg) {
  setReplyTo(msg);
}

useEffect(() => {

  function closeMenu() {
    setContextMenu(null);
  }

  window.addEventListener(
    "click",
    closeMenu
  );

  return () =>
    window.removeEventListener(
      "click",
      closeMenu
    );

}, []);


  /*
  ========================================
  AUTO SCROLL CHAT
  ========================================
  */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  async function acceptProject(id, days) {

  if (!days) {

    alert("Enter delivery days");

    return;

  }

  const deliveryDate = new Date();

  deliveryDate.setDate(
    deliveryDate.getDate() + Number(days)
  );

  const { error } = await supabase
    .from("project_requests")
    .update({
      status: "Active",
      delivery_date: deliveryDate,
    })
    .eq("id", id);

  if (!error) {

    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              status: "Active",
              delivery_date: deliveryDate,
            }
          : project
      )
    );

  }

}
      async function updateProjectStatus(id, status) {

      const { error } = await supabase
        .from("project_requests")
        .update({ status })
        .eq("id", id);

      if (!error) {

        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? { ...project, status }
              : project
          )
        );

      }

    }
async function rejectOffer(id) {

  const { error } = await supabase
    .from("project_requests")
    .update({
      status: "Rejected",
    })
    .eq("id", id);

}

async function markDelivered(id) {

  const { error } = await supabase
    .from("project_requests")
    .update({
      delivered: true,
      delivered_at: new Date(),
      status: "Delivered",
    })
    .eq("id", id);

  if (!error) {

    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              delivered: true,
              status: "Delivered",
            }
          : project
      )
    );

  }

}

async function handleSendMessage() {
  if (!message.trim()) return;

  if (!selectedProject?.email) {
    alert("Select a client first");
    return;
  }

  if (editingMessage) {
    const { error } = await supabase
      .from("messages")
      .update({
        message,
        edited: true,
        edited_at: new Date(),
      })
      .eq("id", editingMessage.id);

    if (!error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessage.id
            ? { ...msg, message, edited: true }
            : msg
        )
      );

      setEditingMessage(null);
      setMessage("");
    }

    return;
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        project_id: null,
        sender: "admin",
        user_email: selectedProject.email,
        message,
        reply_to: replyTo?.id || null,
        is_read: false,
      },
    ])
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  if (data) {
    setMessages((prev) => [...prev, data]);
  }

  setMessage("");
  setReplyTo(null);
}


  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/");

  }

  if (loading) {

    return (

      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">

        <h1 className="text-4xl font-black">
          Loading Admin...
        </h1>

      </main>

    );

  }

  return (

    <main className="h-screen overflow-hidden bg-[#050816] text-white flex">

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 z-50 h-screen w-[280px]
        border-r border-white/10 bg-[#0B1120] p-8 flex flex-col
        transition-all duration-300
        ${sidebarOpen ? "left-0" : "-left-full"}
        lg:left-0`}
      >

        <div className="flex items-center gap-4 mb-16">

          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-black text-2xl font-black">
            A
          </div>

          <div>

            <h1 className="text-3xl font-black">
              Admin Panel
            </h1>

            <p className="text-gray-400 text-sm">
              UpNorth CMS
            </p>

          </div>

        </div>

        {/* MENU */}
        <div className="space-y-3">

          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
            className={`w-full px-5 py-4 rounded-2xl text-left transition ${
              activeTab === "dashboard"
                ? "bg-orange-500 text-black font-bold"
                : "hover:bg-white/5"
            }`}
          >
            Dashboard
          </button>

        <button
          onClick={() => {
            setActiveTab("users");
            setSidebarOpen(false);
          }}
          className={`w-full px-5 py-4 rounded-2xl text-left transition ${
            activeTab === "users"
              ? "bg-orange-500 text-black font-bold"
              : "hover:bg-white/5"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => {
            setActiveTab("projects");
            setSidebarOpen(false);
          }}
          className={`w-full px-5 py-4 rounded-2xl text-left transition ${
            activeTab === "projects"
              ? "bg-orange-500 text-black font-bold"
              : "hover:bg-white/5"
          }`}
        >
          Projects
        </button>

        <button
          onClick={async () => {

            setActiveTab("messages");

            setUnreadMessages(0);

            await supabase
              .from("messages")
              .update({
                is_read: true,
              })
              .eq(
                "user_email",
                user.email
              )
              .eq("sender", "client");

          }}
          className={`w-full text-left px-5 py-4 rounded-2xl transition ${
            activeTab === "messages"
              ? "bg-orange-500 text-black font-bold"
              : "hover:bg-white/5"
          }`}
        >

          <div className="flex items-center justify-between">

            <span>Messages</span>

            {unreadMessages > 0 && (

              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">

                {unreadMessages}

              </span>

            )}

          </div>

        </button>

          <button
  onClick={() => {
    setSidebarOpen(false);
  }}
  className="w-full hover:bg-white/5 px-5 py-4 rounded-2xl text-left transition"
>
            Website CMS
          </button>

          <button
  onClick={() => {
    setSidebarOpen(false);
  }}
  className="w-full hover:bg-white/5 px-5 py-4 rounded-2xl text-left transition"
>
            Settings
          </button>

        </div>

        <div className="mt-auto">

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 py-4 rounded-2xl font-bold"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <div className="p-6 md:p-10 w-full overflow-x-hidden">

        {/* TOPBAR */}
        <div className="border-b border-white/10 px-4 md:px-10 py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="lg:hidden bg-orange-500 text-black px-4 py-3 rounded-xl font-bold w-fit"
        >
          ☰ Menu
        </button>
          <div>

            <h1 className="text-4xl md:text-5xl font-black">

              Welcome Admin

            </h1>

            <p className="text-gray-400 mt-2">
              {user?.email}
            </p>

          </div>

          <a
            href="/"
            className="bg-orange-500 text-black px-6 py-4 rounded-2xl font-bold"
          >
            View Website
          </a>

        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-10">
          {activeTab === "dashboard" && (
            <>
              {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-10">

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden max-w-full">

              <h2 className="text-6xl font-black text-orange-400 mb-3">

                {projects.length}

              </h2>

              <p className="text-gray-400">
                Total Projects
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden">

              <h2 className="text-6xl font-black text-orange-400 mb-3">

                {usersCount}

              </h2>

              <p className="text-gray-400">
                Total Clients
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden">

              <h2 className="text-6xl font-black text-orange-400 mb-3">

                {
                  projects.filter(
                    (p) => p.status === "Pending"
                  ).length
                }

              </h2>

              <p className="text-gray-400">
                Pending Requests
              </p>

            </div>

          </div>

          {/* PROJECT TABLE */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">

            <div className="p-8 border-b border-white/10">

              <h2 className="text-3xl font-black">
                Recent Projects
              </h2>

            </div>

            <div className="overflow-x-auto pb-2">

              <table className="min-w-[900px] w-full">

                <thead className="bg-[#0F172A]">

                  <tr>

                    <th className="text-left px-6 py-5">
                      Client
                    </th>

                    <th className="text-left px-6 py-5">
                      Service
                    </th>

                    <th className="text-left px-6 py-5">
                      Budget
                    </th>

                    <th className="text-left px-6 py-5">
                      Status
                    </th>
                    <th className="text-left px-6 py-5">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

{[
  ...new Map(
    projects.map((p) => [p.email, p])
  ).values(),
].map((project) => (

  <tr
    key={project.id}
    className="border-t border-white/10 hover:bg-white/[0.03] transition"
  >

    <td className="px-6 py-6">

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-lg">

          {project.fullname?.charAt(0)}

        </div>

        <div>

          <h3 className="font-bold text-lg">
            {project.fullname}
          </h3>

          <p className="text-gray-400 text-sm">
            {project.email}
          </p>

        </div>

      </div>

    </td>

    <td className="px-6 py-6">

      <div>

        <h3 className="font-bold">
          {project.service}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {project.timeframe || "No timeframe"}
        </p>

      </div>

    </td>

    <td className="px-6 py-6 font-bold text-orange-400">

      {project.budget}

    </td>

<td className="px-6 py-6">

  <div className="flex flex-col gap-2">

    <span
      className={`px-4 py-2 rounded-xl font-bold text-sm w-fit ${
        project.status === "Pending"
          ? "bg-yellow-500 text-black"
          : project.status === "Active"
          ? "bg-green-500 text-black"
          : project.status === "Delivered"
          ? "bg-blue-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >

      {project.status}

    </span>

    {project.status === "Pending" && (

      <span className="bg-yellow-500 animate-pulse text-black text-xs px-3 py-1 rounded-full font-bold w-fit">

        NEW OFFER

      </span>

    )}

  </div>

</td>

    <td className="px-6 py-6">

<div className="flex gap-3 items-center flex-wrap">

  {/* PENDING */}
  {project.status === "Pending" && (

    <>

      <input
        type="number"
        placeholder="Days"
        min="1"
        value={deliveryDays[project.id] || ""}
        onChange={(e) =>
          setDeliveryDays({
            ...deliveryDays,
            [project.id]: e.target.value,
          })
        }
        className="w-24 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 outline-none"
      />

      <button
        onClick={() =>
          acceptProject(
            project.id,
            deliveryDays[project.id]
          )
        }
        className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-xl font-bold transition"
      >
        Accept
      </button>

      <button
        onClick={() => rejectOffer(project.id)}
        className="bg-red-500 px-4 py-2 rounded-xl font-bold"
      >
        Reject
      </button>

    </>

  )}

  {/* ACTIVE */}
  {project.status === "Active" && (

    <button
      onClick={() =>
        markDelivered(project.id)
      }
      className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl font-bold transition"
    >
      Delivered
    </button>

  )}

  {/* DELIVERED */}
  {project.status === "Delivered" && (

    <span className="text-orange-400 font-bold">

      Waiting Client Approval

    </span>

  )}

  {/* COMPLETED */}
  {project.status === "Completed" && (

    <span className="text-green-400 font-bold">

      Project Completed

    </span>

  )}

</div>

    </td>

  </tr>

))}

                </tbody>

              </table>

            </div>

              </div>

            </>
          )}

{/* USERS */}
{activeTab === "users" && (

  <div className="space-y-10">

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      <div>

        <p className="text-orange-400 uppercase tracking-[4px] text-sm mb-3">
          User Management
        </p>

        <h2 className="text-5xl font-black">
          All Clients
        </h2>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white/5 border border-white/10 rounded-3xl px-6 py-5">

          <h3 className="text-3xl font-black text-orange-400">

            {usersCount}

          </h3>

          <p className="text-gray-400 text-sm">
            Total Users
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl px-6 py-5">

          <h3 className="text-3xl font-black text-green-400">

            {
              projects.filter(
                (p) => p.status === "Active"
              ).length
            }

          </h3>

          <p className="text-gray-400 text-sm">
            Active Projects
          </p>

        </div>

      </div>

    </div>

    {/* USERS TABLE */}
    <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">

      <div className="p-8 border-b border-white/10 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-black">
            Client Directory
          </h2>

          <p className="text-gray-400 mt-2">
            Manage all registered clients and project requests.
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1100px]">

          <thead className="bg-[#0F172A]">

            <tr>

              <th className="text-left px-6 py-5">
                Client
              </th>

              <th className="text-left px-6 py-5">
                Email
              </th>

              <th className="text-left px-6 py-5">
                Service
              </th>

              <th className="text-left px-6 py-5">
                Budget
              </th>

              <th className="text-left px-6 py-5">
                Status
              </th>

              <th className="text-left px-6 py-5">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {[
              ...new Map(
                projects.map((p) => [p.email, p])
              ).values(),
            ].map((project) => (

              <tr
                key={project.id}
                className="border-t border-white/10 hover:bg-white/[0.03] transition"
              >

                {/* CLIENT */}
                <td className="px-6 py-6">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-xl">

                      {project.fullname?.charAt(0)}

                    </div>

                    <div>

                      <h3 className="font-bold text-lg">
                        {project.fullname}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        Client Account
                      </p>

                    </div>

                  </div>

                </td>

                {/* EMAIL */}
                <td className="px-6 py-6 text-gray-300">

                  {project.email}

                </td>

                {/* SERVICE */}
                <td className="px-6 py-6">

                  <div>

                    <h3 className="font-bold">
                      {project.service}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">

                      {project.timeframe || "No timeframe"}

                    </p>

                  </div>

                </td>

                {/* BUDGET */}
                <td className="px-6 py-6 font-bold text-orange-400">

                  {project.budget}

                </td>

                {/* STATUS */}
                <td className="px-6 py-6">

                  <span
                    className={`px-4 py-2 rounded-xl font-bold text-sm ${
                      project.status === "Pending"
                        ? "bg-yellow-500 text-black"
                        : project.status === "Active"
                        ? "bg-green-500 text-black"
                        : project.status === "Delivered"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >

                    {project.status}

                  </span>

                </td>

                {/* ACTION */}
                <td className="px-6 py-6">

                  <button
                    onClick={async () => {

                      setActiveTab("messages");

                      setSelectedProject(project);

                      const { data } =
                        await supabase
                          .from("messages")
                          .select("*")
                          .eq(
                            "user_email",
                            project.email
                          )
                          .order(
                            "created_at",
                            {
                              ascending: true,
                            }
                          );

                      if (data) {

                        setMessages(data);

                      }

                    }}
                    className="bg-orange-500 hover:bg-orange-400 text-black px-5 py-3 rounded-2xl font-bold transition"
                  >

                    Open Chat

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  </div>

)}
      {/* PROJECTS */}
      {activeTab === "projects" && (

        <div className="p-6 md:p-10">

          <h2 className="text-5xl font-black mb-10">
            All Projects
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-[#0F172A]">

                  <tr>

                    <th className="text-left px-6 py-5">
                      Client
                    </th>

                    <th className="text-left px-6 py-5">
                      Service
                    </th>

                    <th className="text-left px-6 py-5">
                      Budget
                    </th>

                    <th className="text-left px-6 py-5">
                      Status
                    </th>

                    <th className="text-left px-6 py-5">
                      Details
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {projects.map((project) => (

                    <tr
                      key={project.id}
                      className="border-t border-white/10 hover:bg-white/[0.03]"
                    >

                      <td className="px-6 py-6">

                        <div>

                          <h3 className="font-semibold text-lg">

                            {project.fullname}

                          </h3>

                          <p className="text-sm text-gray-400">

                            {project.email}

                          </p>

                        </div>

                      </td>

                      <td className="px-6 py-6">

                        <div>

                          <h3 className="font-semibold">

                            {project.service}

                          </h3>

                          <p className="text-sm text-gray-400">

                            {project.timeframe}

                          </p>

                        </div>

                      </td>

                      <td className="px-6 py-6 text-orange-400 font-bold">

                        {project.budget}

                      </td>

                      <td className="px-6 py-6">

                        <span className="bg-orange-500 text-black px-4 py-2 rounded-xl font-bold text-sm">

                          {project.status}

                        </span>

                      </td>

                      <td className="px-6 py-6 max-w-[400px]">

                        <p className="text-gray-300 text-sm leading-7 break-words line-clamp-3">

                          {project.details}

                        </p>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}
      {/* MESSAGES */}
{activeTab === "messages" && (

  <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

    {/* CLIENT LIST */}
    <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">

      <div className="p-6 border-b border-white/10">

        <h2 className="text-3xl font-black mb-2">
          Client Messages
        </h2>

        <p className="text-gray-400">
          Chat with all project clients.
        </p>

      </div>

        <div className="p-4 space-y-4">

        {[
          ...new Map(
            [...projects, ...messageUsers].map((p) => [
              p.email,
              p,
            ])
          ).values(),
        ].map((project) => (

            <button
              key={project.id}
              onClick={async () => {

                setSelectedProject(project);

                const { data } = await supabase
                  .from("messages")
                  .select("*")
                  .eq(
                    "user_email",
                    project.email
                  )
                  .order("created_at", {
                    ascending: true,
                  });

                if (data) {

                  setMessages(data);

                  const { count } = await supabase
                    .from("messages")
                    .select("*", {
                      count: "exact",
                      head: true,
                    })
                    .eq("sender", "client")
                    .eq("is_read", false);

                  setUnreadMessages(count || 0);

                  await supabase
                  .from("messages")
                  .update({
                    is_read: true,
                  })
                  .eq(
                    "user_email",
                    project.email
                  )
                  .eq("sender", "client");

                }

              }}>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-black font-black">

                {project.fullname?.charAt(0)}

              </div>

              <div>

                <h3 className="font-black text-lg">
                  {project.fullname}
                </h3>

                <p className="text-sm text-gray-400">
                  {project.service}
                </p>

                {project.status === "Pending" && (

                  <span className="inline-block mt-2 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">

                    NEW OFFER

                  </span>

                )}

              </div>

            </div>

          </button>

        ))}

      </div>

    </div>

    {/* CHAT WINDOW */}
    <div className="bg-white/5 border border-white/10 rounded-[32px] flex flex-col overflow-hidden h-[85vh] max-h-[85vh]">

      {/* TOP */}
      <div className="border-b border-white/10 p-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-black font-black">

            A

          </div>

          <div>

          <h3 className="text-2xl font-black">

            {selectedProject
              ? selectedProject.fullname
              : "Select A Client"}

          </h3>
          <p className="text-gray-400 text-sm">

            {selectedProject
              ? selectedProject.email
              : "No client selected"}

          </p>

          </div>

        </div>

      </div>

{/* CHAT BODY */}
<div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0">

  {/* WELCOME MESSAGE */}
{!selectedProject && (

  <div className="max-w-[80%]">

    <div className="bg-[#0F172A] border border-white/10 rounded-3xl rounded-tl-md px-6 py-5">

      <p className="leading-8 text-gray-300">
        Select a client to start chatting 👋
      </p>

    </div>

  </div>

)}

  {/* REAL CHAT MESSAGES */}
  {messages
  .filter((msg) => !msg.deleted)
  .map((msg) => (

    <div
      id={`message-${msg.id}`}
      key={msg.id}
      className={`max-w-[75%] break-words ${
        msg.sender === "admin"
          ? "ml-auto"
          : ""
      }`}
    >

      <div
        onContextMenu={(e) => {
          e.preventDefault();

          setContextMenu({
            x: e.pageX,
            y: e.pageY,
            message: msg,
          });
        }}
                onTouchStart={(e) => {
                    const touch = e.touches[0];

                    const timer = setTimeout(() => {
                      setContextMenu({
                        x: touch.clientX,
                        y: touch.clientY,
                        message: msg,
                      });
                    }, 600);

                    e.currentTarget.dataset.timer = timer;
                  }}

                  onTouchEnd={(e) => {
                    clearTimeout(e.currentTarget.dataset.timer);
                  }}
        className={`px-6 py-5 rounded-3xl ${
          msg.sender === "admin"
            ? "bg-orange-500 text-black rounded-tr-md"
            : "bg-[#0F172A] border border-white/10 rounded-tl-md"
        }`}
      >

        {msg.reply_to && (
          <div
            onClick={() => {
              const element = document.getElementById(
                `message-${msg.reply_to}`
              );

              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });

                element.classList.add(
                  "ring-2",
                  "ring-orange-500"
                );

                setTimeout(() => {
                  element.classList.remove(
                    "ring-2",
                    "ring-orange-500"
                  );
                }, 2000);
              }
            }}
            className="mb-3 border-l-4 border-orange-500 bg-black/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-black/40 transition"
          >

    <p className="text-orange-400 text-xs font-bold mb-1">
      Reply
    </p>

    <p className="text-sm opacity-70 line-clamp-2">
      {
        messages.find(
          (m) =>
            String(m.id) ===
            String(msg.reply_to)
        )?.message || "Message"
      }
    </p>

  </div>
)}

<p>{msg.message}</p>

      </div>
      {msg.edited && !msg.deleted && (
  <p className="text-xs opacity-60 mt-2">
    Edited
  </p>
)}

    </div>

  ))}
  <div ref={bottomRef}></div>

</div>

{contextMenu && (

  <div
    className="fixed z-50 bg-[#111827] border border-white/10 rounded-2xl py-2 w-52 shadow-2xl"
    style={{
      top: contextMenu.y,
      left: contextMenu.x,
    }}
  >

    <button
      onClick={() => {
        handleReplyMessage(
          contextMenu.message
        );

        setContextMenu(null);
      }}
      className="w-full text-left px-5 py-3 hover:bg-white/5"
    >
      Reply
    </button>

    {contextMenu.message.sender === "admin" &&
  canModifyMessage(contextMenu.message) && (
      <>
        <button
          onClick={() => {
            handleEditMessage(
              contextMenu.message
            );

            setContextMenu(null);
          }}
          className="w-full text-left px-5 py-3 hover:bg-white/5"
        >
          Edit
        </button>

        <button
          onClick={() => {
            handleDeleteMessage(
              contextMenu.message
            );

            setContextMenu(null);
          }}
          className="w-full text-left px-5 py-3 text-red-400 hover:bg-white/5"
        >
          Delete
        </button>
      </>
    )}

  </div>

)}

{replyTo && (
  <div className="mx-5 mb-3 bg-[#0F172A] border border-orange-500/40 rounded-2xl px-5 py-3 flex justify-between gap-4">
    <div>
      <p className="text-orange-400 text-sm font-bold">
        Replying to message
      </p>

      <p className="text-gray-300 text-sm line-clamp-1">
        {replyTo.message}
      </p>
    </div>

    <button
      onClick={() => setReplyTo(null)}
      className="text-red-400 font-bold"
    >
      ✕
    </button>
  </div>
)}

      {/* INPUT */}
      <div className="border-t border-white/10 p-5 shrink-0">

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Reply client..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-orange-500"
          />

        <button
          onClick={handleSendMessage}
          className="bg-orange-500 text-black px-5 md:px-8 py-4 rounded-2xl font-black whitespace-nowrap w-full sm:w-auto"
        >
          Send
        </button>

        </div>

      </div>

    </div>

  </div>

)}

        </div>

      </div>

    </main>

  );

}