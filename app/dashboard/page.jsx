"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function DashboardPage() {

  const router = useRouter();

  const bottomRef = useRef(null);

  /*
  ========================================
  STATES
  ========================================
  */

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [projects, setProjects] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [
    unreadMessages,
    setUnreadMessages,
  ] = useState(0);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [editingMessage, setEditingMessage] =
  useState(null);

  const [replyTo, setReplyTo] =
    useState(null);
    
    const [contextMenu, setContextMenu] =
  useState(null);

  /*
  ========================================
  LOAD DASHBOARD
  ========================================
  */

  useEffect(() => {

    async function loadDashboard() {

      /*
      ==========================
      SESSION
      ==========================
      */

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {

        router.push("/login");
        return;

      }

      setUser(session.user);

      setFullName(
        session.user.user_metadata?.full_name ||
          ""
      );

      /*
      ==========================
      LOAD USER PROJECTS ONLY
      ==========================
      */

      const { data: projectsData, error } =
        await supabase
          .from("project_requests")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", {
            ascending: false,
          });

      if (error) {

        console.log(error);

      }

      if (projectsData) {

        setProjects(projectsData);

        /*
        ==========================
        AUTO SELECT FIRST PROJECT
        ==========================
        */

        if (projectsData.length > 0) {

          setSelectedProject(projectsData[0]);

        }

      }

      /*
      ==========================
      LOAD MESSAGES
      ==========================
      */

      const { data: messagesData } =
        await supabase
          .from("messages")
          .select("*")
          .eq("user_email", session.user.email)
          .order("created_at", {
            ascending: true,
          });

      if (messagesData) {

        setMessages(messagesData);
        const { count } = await supabase
        .from("messages")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "user_email",
          session.user.email
        )
        .eq("sender", "admin")
        .eq("is_read", false);

      setUnreadMessages(count || 0);

      }

      /*
      ==========================
      AUTO COMPLETE DELIVERED
      ==========================
      */

      if (projectsData) {

        projectsData.forEach(
          async (project) => {

            if (
              project.status === "Delivered" &&
              !project.client_approved
            ) {

              const deliveredAt =
                new Date(
                  project.delivered_at
                );

              const now = new Date();

              const diffDays =
                (now - deliveredAt) /
                (1000 * 60 * 60 * 24);

              if (diffDays >= 3) {

                await supabase
                  .from("project_requests")
                  .update({
                    client_approved: true,
                    completed: true,
                    status: "Completed",
                  })
                  .eq("id", project.id);

              }

            }

          }
        );

      }

      setLoading(false);

    }

    loadDashboard();

    /*
    ========================================
    REALTIME CHAT
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
        async (payload) => {

          const newMessage = payload.new;

          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (
            newMessage.user_email !==
            session?.user?.email
          ) {
            return;
          }

          setMessages((prev) => {

            const exists = prev.some(
              (msg) => msg.id === newMessage.id
            );

            if (exists) return prev;

            return [...prev, newMessage];

          });

          /*
          NOTIFICATION COUNT
          */

          if (
            newMessage.sender === "admin"
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

  }, []);

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // LOGOUT
  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/");

  }

async function handleSendMessage() {
  if (!message.trim()) return;

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
            ? {
                ...msg,
                message,
                edited: true,
                edited_at: new Date(),
              }
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
        project_id: selectedProject?.id || null,
        sender: "client",
        user_email: user.email,
        message,
        reply_to: replyTo ? String(replyTo.id) : null,
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
  // send email notification to admin
  try {
    const response = await fetch("/api/send-message-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "sulaimonganiyu315@gmail.com",
        subject: "New Client Message",
        message: `\n${user.email} sent a message.\n\nMessage:\n${message}\n`,
      }),
    });

    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error("Email send error:", err);
  }

  // CLEAR INPUT
  setMessage("");
  setReplyTo(null);

}

  if (loading) {

    return (

      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-3xl font-black">
            Loading Dashboard...
          </h2>

        </div>

      </main>

    );

  }

  async function handleSaveProfile() {

  const { error } = await supabase.auth.updateUser({

    data: {
      full_name: fullName,
    },

  });

  if (!error) {

    setUser((prev) => ({
      ...prev,
      user_metadata: {
        ...prev.user_metadata,
        full_name: fullName,
      },
    }));

    setEditingProfile(false);

    alert("Profile updated successfully");

  } else {

    alert("Failed to update profile");

  }

}
function handleChoosePlan(plan) {

  alert(`You selected the ${plan} plan`);

}

    async function approveProject(id) {

      const { error } = await supabase
        .from("project_requests")
        .update({
          client_approved: true,
          completed: true,
          status: "Completed",
        })
        .eq("id", id);

      if (!error) {

        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? {
                  ...project,
                  status: "Completed",
                  completed: true,
                }
              : project
          )
        );

      }

    }

    async function rejectProject(id) {

  const { error } = await supabase
    .from("project_requests")
    .update({
      status: "Revision",
    })
    .eq("id", id);

  if (!error) {

    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              status: "Revision",
            }
          : project
      )
    );

  }

}

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

return (

  <main
    onClick={() => setContextMenu(null)}
    className="h-screen overflow-hidden bg-[#050816] text-white flex"
  >

      {/* MOBILE MENU */}
      {menuOpen && (

        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">

          <div className="w-[300px] h-full bg-[#0B1120] border-r border-white/10 p-6 overflow-y-auto">

            {/* TOP */}
            <div className="flex items-center justify-between mb-10">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-black font-black">
                  U
                </div>

                <div>

                  <h2 className="text-2xl font-black">
                    UpNorth
                  </h2>

                  <p className="text-gray-400 text-sm">
                    Dashboard
                  </p>

                </div>

              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-xl"
              >
                ✕
              </button>

            </div>

            {/* USER */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-black text-2xl font-black">

                  {user?.email?.charAt(0).toUpperCase()}

                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Client
                  </h3>

                  <p className="text-gray-400 text-sm break-all">
                    {user?.email}
                  </p>

                </div>

              </div>

            </div>

            {/* MENU */}
            <div className="space-y-3">

              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-2xl transition ${
                  activeTab === "dashboard"
                    ? "bg-orange-500 text-black font-bold"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  setActiveTab("projects");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-2xl transition ${
                  activeTab === "projects"
                    ? "bg-orange-500 text-black font-bold"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Projects
              </button>

              <button
                onClick={() => {
                  setActiveTab("messages");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-2xl transition ${
                  activeTab === "messages"
                    ? "bg-orange-500 text-black font-bold"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Messages
              </button>

              <button
                onClick={() => {
                  setActiveTab("offers");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-2xl transition ${
                  activeTab === "offers"
                    ? "bg-orange-500 text-black font-bold"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Offers
              </button>

              <button
                onClick={() => {
                  setActiveTab("profile");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-2xl transition ${
                  activeTab === "profile"
                    ? "bg-orange-500 text-black font-bold"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Profile
              </button>

              <a
                href="/"
                className="block bg-white/5 hover:bg-orange-500 hover:text-black px-5 py-4 rounded-2xl transition font-bold text-center"
              >
                Home Page
              </a>

              <a
                href="/request"
                className="block bg-orange-500 text-black px-5 py-4 rounded-2xl font-bold text-center"
              >
                New Project
              </a>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 py-4 rounded-2xl font-bold mt-5"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="w-[290px] hidden lg:flex flex-col border-r border-white/10 bg-[#0B1120] p-8 h-screen sticky top-0 overflow-y-auto">

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-16">

          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-black text-2xl font-black">
            U
          </div>

          <div>

            <h1 className="text-3xl font-black">
              UpNorth
            </h1>

            <p className="text-gray-400 text-sm">
              Client Dashboard
            </p>

          </div>

        </div>

        {/* USER */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-10">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-black text-2xl font-black">

              {user?.email?.charAt(0).toUpperCase()}

            </div>

            <div>

              <h3 className="font-black text-lg">
                Client
              </h3>

              <p className="text-gray-400 text-sm break-all">
                {user?.email}
              </p>

            </div>

          </div>

        </div>

        {/* MENU */}
        <div className="space-y-3">

          <button
            onClick={() => {
              setActiveTab("dashboard");
            }}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activeTab === "dashboard"
                ? "bg-orange-500 text-black font-bold"
                : "hover:bg-white/5"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
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
                .eq("sender", "admin");

            }}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activeTab === "messages"
                ? "bg-orange-500 text-black font-bold"
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between w-full">

            <span>Messages</span>

            {unreadMessages > 0 && (

              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">

                {unreadMessages}

              </span>

            )}

          </div>
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activeTab === "offers"
                ? "bg-orange-500 text-black font-bold"
                : "hover:bg-white/5"
            }`}
          >
            Offers
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-5 py-4 rounded-2xl transition ${
              activeTab === "profile"
                ? "bg-orange-500 text-black font-bold"
                : "hover:bg-white/5"
            }`}
          >
            Profile
          </button>

          <a
            href="/"
            className="block bg-white/5 hover:bg-orange-500 hover:text-black px-5 py-4 rounded-2xl transition font-bold"
          >
            Home Page
          </a>

        </div>

        {/* LOGOUT */}
      <div className="pt-10">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 py-4 rounded-2xl font-bold"
        >
          Logout
        </button>
      </div>
      </aside>

      {/* MAIN */}
      <section className="flex-1 h-screen overflow-y-auto overflow-x-hidden">

        {/* TOPBAR */}
        <div className="sticky top-0 z-30 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10 px-5 md:px-10 py-5">

          <div className="flex items-center justify-between gap-5">

            {/* LEFT */}
            <div className="flex items-center gap-4">

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl"
              >
                ☰
              </button>

              <div>

                <h1 className="text-2xl md:text-5xl font-black leading-tight">

                  Welcome,
                  <span className="text-orange-500 ml-2">
                    Client
                  </span>

                </h1>

                <p className="text-gray-400 text-sm md:text-base mt-1 break-all">

                  {user?.email}

                </p>

              </div>

            </div>

            {/* RIGHT */}
            <div className="hidden md:flex items-center gap-4">

              <a
                href="/"
                className="border border-white/10 px-6 py-4 rounded-2xl font-bold hover:border-orange-500 transition"
              >
                Home
              </a>

              <a
                href="/request"
                className="bg-orange-500 text-black px-6 py-4 rounded-2xl font-bold hover:scale-105 transition"
              >
                New Project
              </a>

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-10">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (

            <div>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 mb-10">

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden max-w-full">

                  <h2 className="text-6xl font-black text-orange-400 mb-3">
                    {projects.length}
                  </h2>

                  <p className="text-gray-400 text-lg">
                    Total Projects
                  </p>

                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden max-w-full">

                  <h2 className="text-6xl font-black text-orange-400 mb-3">

                    {
                      projects.filter(
                        (p) => p.status === "Active"
                      ).length
                    }

                  </h2>

                  <p className="text-gray-400 text-lg">
                    Active Projects
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

                  <p className="text-gray-400 text-lg">
                    Pending Requests
                  </p>

                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden">

                <h2 className="text-6xl font-black text-blue-400 mb-3">

                  {
                    projects.filter(
                      (p) => p.status === "Delivered"
                    ).length
                  }

                </h2>

                <p className="text-gray-400 text-lg">
                  Awaiting Approval
                </p>

              </div>

              </div>

              {/* RECENT */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-10">

                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">

                  <h2 className="text-3xl md:text-4xl font-black">
                    Recent Projects
                  </h2>

                  <a
                    href="/request"
                    className="bg-orange-500 text-black px-5 py-3 rounded-2xl font-bold"
                  >
                    + New Request
                  </a>

                </div>

                {projects.length === 0 ? (

                  <div className="text-center py-16">

                    <h3 className="text-3xl font-black mb-4">
                      No Projects Yet
                    </h3>

                    <p className="text-gray-400 mb-8">
                      Start your first project request now.
                    </p>

                    <a
                      href="/request"
                      className="inline-block bg-orange-500 text-black px-8 py-4 rounded-2xl font-bold"
                    >
                      Start Project
                    </a>

                  </div>

                ) : (

                  <div className="space-y-6 w-full overflow-hidden">

                    {projects.slice(0, 5).map((project) => (

                      <div
                        key={project.id}
                        className="bg-[#0F172A] border border-white/10 rounded-3xl p-6"
                      >

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                          <div>

                            <h3 className="text-2xl font-black mb-2">
                              {project.service}
                            </h3>

                            <div className="text-gray-400">
                              
                              <p>
                                {project.budget} • {project.timeframe}
                              </p>

                              {project.delivery_date &&
                                project.status === "Active" && (

                                <div className="text-orange-400 mt-2 font-bold">

                                  Delivery:
                                  {" "}
                                  {Math.max(
                                    0,
                                    Math.ceil(
                                      (
                                        new Date(project.delivery_date) -
                                        new Date()
                                      ) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  )}{" "}
                                  days left

                                </div>

                              )}

                            </div>

                          </div>

                          <div className="flex flex-col items-start gap-3">

                            <span className="bg-orange-500 text-black px-5 py-3 rounded-2xl font-bold w-fit">

                              {project.status}

                            </span>

                            {/* CLIENT DELIVERY ACTIONS */}
                            {project.status === "Delivered" && (

                            <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-3 rounded-2xl mt-4">

                              Admin delivered this project.
                              Please review and approve.

                            </div>

                          )}
                            {project.status === "Delivered" && (

                              <div className="flex gap-3">

                                <button
                                  onClick={() =>
                                    approveProject(project.id)
                                  }
                                  className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
                                >
                                  Accept Delivery
                                </button>

                                <button
                                  className="bg-red-500 text-white px-5 py-3 rounded-2xl font-black"
                                >
                                  Reject
                                </button>

                              </div>

                            )}

                            {/* COMPLETED */}
                            {project.status === "Completed" && (

                              <span className="text-green-400 font-bold">
                                Project Completed
                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          )}

          {/* PROJECTS */}
          {activeTab === "projects" && (

            <div>

              <h2 className="text-4xl font-black mb-10">
                My Projects
              </h2>

              <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">

                {projects.length === 0 ? (

                  <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">

                    <p className="text-gray-400 text-lg">
                      No projects submitted yet.
                    </p>

                  </div>

                ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">

                  <thead className="bg-[#0F172A]">

                    <tr>

                      <th className="text-left px-6 py-5">
                        Service
                      </th>

                      <th className="text-left px-6 py-5">
                        Budget
                      </th>

                      <th className="text-left px-6 py-5">
                        Delivery
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

                          {project.delivery_date ? (

                            <span className="text-orange-400 font-bold">

                              {Math.max(
                                0,
                                Math.ceil(
                                  (
                                    new Date(project.delivery_date) -
                                    new Date()
                                  ) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )}{" "}
                              days left

                            </span>

                          ) : (

                            <span className="text-gray-500">
                              Pending
                            </span>

                          )}

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

                          {project.status === "Delivered" &&
                            !project.client_approved && (

                            <div className="flex gap-3 mt-4">

                              <button
                                onClick={() =>
                                  approveProject(project.id)
                                }
                                className="bg-green-500 text-black px-4 py-2 rounded-xl font-bold"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  rejectProject(project.id)
                                }
                                className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold"
                              >
                                Reject
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

                )}

              </div>

            </div>

          )}
{/* MESSAGES */}
{activeTab === "messages" && (

  <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">

    {/* CONTACTS */}
    <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">

      <div className="p-6 border-b border-white/10">

        <h2 className="text-3xl font-black mb-2">
          Messages
        </h2>

        <p className="text-gray-400">
          Chat with UpNorth support team.
        </p>

      </div>

      <div className="p-4">

        <button className="w-full bg-orange-500/20 border border-orange-500 rounded-2xl p-5 text-left">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-black font-black">
              U
            </div>

            <div>

              <h3 className="font-black text-lg">
                UpNorth Support
              </h3>

              <p className="text-sm text-gray-300">
                Welcome to your dashboard 👋
              </p>

            </div>

          </div>

        </button>

      </div>

    </div>

    {/* CHAT WINDOW */}
    <div className="bg-white/5 border border-white/10 rounded-[32px] flex flex-col overflow-hidden h-[85vh] max-h-[85vh]">

      {/* TOP */}
      <div className="border-b border-white/10 p-6 flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-black font-black">
          U
        </div>

        <div>

          <h3 className="text-2xl font-black">
            UpNorth Support
          </h3>

          <p className="text-green-400 text-sm">
            Online
          </p>

        </div>

      </div>

      {/* BODY */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0">


        {messages
  .filter((msg) => !msg.deleted)
  .map((msg) => (

          <div
            id={`message-${msg.id}`}
            key={msg.id}
            className={`max-w-[75%] break-words ${
              msg.sender === "client"
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
                msg.sender === "client"
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

              <p className="text-sm opacity-80 line-clamp-2">
                {
                  messages.find(
                    (m) => String(m.id) === String(msg.reply_to)
                  )?.message || "Original message"
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

  {contextMenu.message.sender === "client" &&
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
        <div className="mb-3 bg-[#0F172A] border border-orange-500/40 rounded-2xl px-5 py-3 flex justify-between gap-4">

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

        <div className="flex gap-3 items-center">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-orange-500"
          />

          <button
            onClick={handleSendMessage}
            className="bg-orange-500 text-black px-5 md:px-8 py-4 rounded-2xl font-black whitespace-nowrap"
          >
            Send
          </button>

        </div>

      </div>

    </div>

  </div>

)}

{/* OFFERS */}
{activeTab === "offers" && (

  <div className="space-y-10">

    <div>

      <p className="text-orange-400 uppercase tracking-[4px] text-sm mb-3">
        Premium Packages
      </p>

      <h2 className="text-4xl md:text-5xl font-black">
        Choose Your Plan
      </h2>

    </div>

    <div className="grid xl:grid-cols-3 gap-8">

      {/* STARTER */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 hover:border-orange-500 transition">

        <p className="text-orange-400 font-bold mb-4">
          STARTER
        </p>

        <h3 className="text-5xl font-black mb-2">
          $500
        </h3>

        <p className="text-gray-400 mb-8">
          Perfect for landing pages and simple business websites.
        </p>

        <div className="space-y-4 mb-10 text-gray-300">

          <p>✔ Responsive Website</p>
          <p>✔ Modern UI Design</p>
          <p>✔ Contact Form</p>
          <p>✔ Mobile Optimization</p>

        </div>

        <button
            onClick={() => handleChoosePlan("Starter")}
            className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black hover:scale-[1.02] transition"
          >
          Choose Starter
        </button>

      </div>

      {/* PREMIUM */}
      <div className="relative bg-orange-500 text-black rounded-[40px] p-8 scale-[1.03] shadow-2xl shadow-orange-500/20">

        <div className="absolute top-5 right-5 bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
          MOST POPULAR
        </div>

        <p className="font-bold mb-4">
          PREMIUM
        </p>

        <h3 className="text-5xl font-black mb-2">
          $2,500
        </h3>

        <p className="mb-8 opacity-80">
          Best for scalable platforms, dashboards and automation systems.
        </p>

        <div className="space-y-4 mb-10">

          <p>✔ Full Stack Web App</p>
          <p>✔ Dashboard System</p>
          <p>✔ Authentication</p>
          <p>✔ API Integration</p>
          <p>✔ Priority Support</p>

        </div>

        <button
            onClick={() => handleChoosePlan("Premium")}
            className="w-full bg-black text-white py-5 rounded-2xl font-black hover:scale-[1.02] transition"
          >
          Choose Premium
        </button>

      </div>

      {/* ENTERPRISE */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 hover:border-orange-500 transition">

        <p className="text-orange-400 font-bold mb-4">
          ENTERPRISE
        </p>

        <h3 className="text-5xl font-black mb-2">
          Custom
        </h3>

        <p className="text-gray-400 mb-8">
          Advanced infrastructure for large businesses and SaaS platforms.
        </p>

        <div className="space-y-4 mb-10 text-gray-300">

          <p>✔ Custom Architecture</p>
          <p>✔ AI Automation</p>
          <p>✔ Trading Systems</p>
          <p>✔ Dedicated Support</p>
          <p>✔ Unlimited Scaling</p>

        </div>

        <button
          onClick={() => handleChoosePlan("Enterprise")}
          className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black hover:scale-[1.02] transition"
        >
          Contact Enterprise
        </button>

      </div>

    </div>

  </div>

)}

{/* PROFILE */}
{activeTab === "profile" && (

  <div className="space-y-8">

    {/* PROFILE HEADER */}
    <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[40px]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,115,0,0.15),transparent_35%)]"></div>

      <div className="relative z-10 p-8 md:p-12">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* LEFT */}
          <div className="flex flex-col md:flex-row md:items-center gap-8">

            {/* AVATAR */}
            <div className="relative">

              <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-30 rounded-full"></div>

              <div className="relative w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center text-black text-6xl font-black border-4 border-white/10 shadow-2xl">

                {user?.email?.charAt(0).toUpperCase()}

              </div>

            </div>

            {/* INFO */}
            <div>

              <p className="uppercase tracking-[4px] text-orange-400 text-sm mb-3">
                Client Account
              </p>

              <h2 className="text-4xl md:text-5xl font-black mb-4">
                {user?.user_metadata?.full_name || "Client"}
              </h2>

              <p className="text-gray-400 text-lg mb-6 break-all">
                {user?.email}
              </p>

              <div className="flex flex-wrap gap-4">

                <div className="bg-[#0F172A] border border-white/10 px-5 py-3 rounded-2xl">

                  <p className="text-gray-400 text-sm mb-1">
                    Account Status
                  </p>

                  <h3 className="font-bold text-green-400">
                    Active
                  </h3>

                </div>

                <div className="bg-[#0F172A] border border-white/10 px-5 py-3 rounded-2xl">

                  <p className="text-gray-400 text-sm mb-1">
                    Total Projects
                  </p>

                  <h3 className="font-bold text-orange-400">
                    {projects.length}
                  </h3>

                </div>

                <div className="bg-[#0F172A] border border-white/10 px-5 py-3 rounded-2xl">

                  <p className="text-gray-400 text-sm mb-1">
                    Membership
                  </p>

                  <h3 className="font-bold">
                    Premium Client
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex flex-col gap-4 min-w-[220px]">

          <button
            onClick={() => setEditingProfile(true)}
            className="bg-orange-500 text-black py-4 rounded-2xl font-black hover:scale-[1.02] transition"
          >
            Edit Profile
          </button>

            <button className="bg-white/5 border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/10 transition">

              Change Password

            </button>

          </div>

        </div>

      </div>

    </div>

    {/* ACCOUNT DETAILS */}
    <div className="grid lg:grid-cols-2 gap-8">

      {/* PERSONAL INFO */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden max-w-full">

        <div className="flex items-center justify-between mb-8">

          <h3 className="text-3xl font-black">
            Personal Info
          </h3>

          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-black font-black">
            P
          </div>

        </div>

        <div className="space-y-6 w-full overflow-hidden">

          <div>

            <p className="text-gray-400 mb-2">
              Full Name
            </p>

            <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-lg">

              {user?.user_metadata?.full_name || "Client"}

            </div>

          </div>

          <div>

            <p className="text-gray-400 mb-2">
              Email Address
            </p>

            <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-lg break-all">

              {user?.email}

            </div>

          </div>

          <div>

            <p className="text-gray-400 mb-2">
              Account Type
            </p>

            <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-lg">

              Client Dashboard Access

            </div>

          </div>

        </div>

      </div>

      {/* ACTIVITY */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden max-w-full">

        <div className="flex items-center justify-between mb-8">

          <h3 className="text-3xl font-black">
            Activity
          </h3>

          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-black font-black">
            A
          </div>

        </div>

        <div className="space-y-6 w-full overflow-hidden">

          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-2">

              <h4 className="font-bold text-lg">
                Projects Submitted
              </h4>

              <span className="text-orange-400 text-2xl font-black">
                {projects.length}
              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Total projects requested from dashboard.
            </p>

          </div>

          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-2">

              <h4 className="font-bold text-lg">
                Active Requests
              </h4>

              <span className="text-orange-400 text-2xl font-black">

                {
                  projects.filter(
                    (p) => p.status === "Active"
                  ).length
                }

              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Projects currently in development.
            </p>

          </div>

          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-2">

              <h4 className="font-bold text-lg">
                Pending Requests
              </h4>

              <span className="text-orange-400 text-2xl font-black">

                {
                  projects.filter(
                    (p) => p.status === "Pending"
                  ).length
                }

              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Waiting for approval or review.
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

)}

{/* EDIT PROFILE MODAL */}
{editingProfile && (

  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">

    <div className="bg-[#0B1120] border border-white/10 rounded-[40px] p-8 w-full max-w-2xl">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-4xl font-black">
          Edit Profile
        </h2>

        <button
          onClick={() => setEditingProfile(false)}
          className="text-3xl"
        >
          ✕
        </button>

      </div>

      <div className="space-y-6 w-full overflow-hidden">

        <div>

          <p className="text-gray-400 mb-3">
            Full Name
          </p>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-orange-500"
          />

        </div>

        <div>

          <p className="text-gray-400 mb-3">
            Email
          </p>

          <input
            disabled
            value={user?.email}
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 opacity-60"
          />

        </div>

      <button
        onClick={handleSaveProfile}
        className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black hover:scale-[1.02] transition"
      >
        Save Changes
      </button>

      </div>

    </div>

  </div>

)}

        </div>

      </section>

    </main>

  );

}