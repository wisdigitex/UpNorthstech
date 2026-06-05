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
  const touchTimer = useRef(null);

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

  const [projectFilter, setProjectFilter] = useState("All");
  const [projectSearch, setProjectSearch] = useState("");

  const [uploadingFile, setUploadingFile] = useState(false);
    
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
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [...prev, data];
      });
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

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  setUploadingFile(true);

  const filePath = `${user.email}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("chat-files")
    .upload(filePath, file);

  if (uploadError) {
    alert(uploadError.message);
    setUploadingFile(false);
    return;
  }

  const { data } = supabase.storage
    .from("chat-files")
    .getPublicUrl(filePath);

  const fileUrl = data.publicUrl;

const { data: insertedMessage, error } = await supabase
  .from("messages")
  .insert([
    {
      project_id: selectedProject?.id || null,
      sender: "client",
      user_email: user.email,
      message: "",
      file_url: fileUrl,
      file_name: file.name,
      file_type: file.type,
      reply_to: replyTo ? String(replyTo.id) : null,
      is_read: false,
    },
  ])
  .select()
  .single();

if (error) {
  alert(error.message);
  setUploadingFile(false);
  return;
}

if (insertedMessage) {
  setMessages((prev) => {
    if (
      prev.some(
        (msg) => msg.id === insertedMessage.id
      )
    ) {
      return prev;
    }

    return [...prev, insertedMessage];
  });
}

  setUploadingFile(false);
}

async function handleChoosePlan(plan) {
  if (!user?.email) {
    alert("Please login first");
    router.push("/login");
    return;
  }

  const planData = {
    Starter: {
      service: "Starter Website Package",
      budget: "$500",
      timeframe: "1-2 Weeks",
    },
    Premium: {
      service: "Premium Web App Package",
      budget: "$2,500",
      timeframe: "2-4 Weeks",
    },
    Enterprise: {
      service: "Enterprise Custom Package",
      budget: "Custom",
      timeframe: "Custom",
    },
  };

  const selected = planData[plan];

  const confirmOrder = confirm(
    `Submit request for ${plan} plan?\n\nBudget: ${selected.budget}`
  );

  if (!confirmOrder) return;

  const { error } = await supabase
    .from("project_requests")
    .insert([
      {
        user_id: user.id,
        fullname:
          user.user_metadata?.fullname ||
          user.user_metadata?.full_name ||
          user.email.split("@")[0],
        email: user.email,
        service: selected.service,
        budget: selected.budget,
        timeframe: selected.timeframe,
        contract: "Project Based",
        details: `Client selected the ${plan} package from dashboard offers.`,
        status: "Pending",
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Offer sent to admin successfully ✅");
  setActiveTab("projects");
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

const filteredProjects = projects.filter((project) => {
  const matchesFilter =
    projectFilter === "All" ||
    project.status === projectFilter;

  const searchText = projectSearch.toLowerCase();

  const matchesSearch =
    project.service?.toLowerCase().includes(searchText) ||
    project.details?.toLowerCase().includes(searchText) ||
    project.budget?.toLowerCase().includes(searchText) ||
    project.timeframe?.toLowerCase().includes(searchText);

  return matchesFilter && matchesSearch;
});

return (

      <main
        onClick={() => setContextMenu(null)}
        className={`bg-[#050816] text-white lg:flex ${
          activeTab === "messages"
            ? "h-screen overflow-hidden"
            : "min-h-screen"
        }`}
      >

      {/* MOBILE MENU */}
      {menuOpen && (

        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">

          <div className="w-[300px] h-full bg-[#0B1120] border-r border-white/10 p-6 overflow-y-auto">

            {/* TOP */}
            <div className="flex items-center justify-between mb-10">

          <a href="/" className="flex items-center h-14 overflow-visible">
            <img
              src="/images/logo.png"
              alt="UpNorth Tech Logo"
              className="h-32 w-auto object-contain scale-[1.4] origin-left"
            />
          </a>

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

          <a href="/" className="flex items-center h-14 overflow-visible">
            <img
              src="/images/logo.png"
              alt="UpNorth Tech Logo"
              className="h-14 w-auto object-contain"
            />
          </a>

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
      <section
        className={`flex-1 overflow-x-hidden ${
          activeTab === "messages"
            ? "h-screen overflow-hidden"
            : "min-h-screen"
        }`}
      >

        {/* TOPBAR */}
        <div className="hidden lg:block sticky top-0 z-30 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10 px-5 md:px-10 py-5">

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
{/* CONTENT */}
<div
  className={`${
    activeTab === "messages"
      ? "p-4 pb-[82px] h-screen overflow-hidden"
      : activeTab === "dashboard"
      ? "p-4 md:p-10 pb-16 lg:pb-10"
      : activeTab === "projects"
      ? "p-4 md:p-10 pb-6 lg:pb-10"
      : activeTab === "offers"
      ? "p-4 md:p-10 pb-6 lg:pb-10"
      : activeTab === "profile"
      ? "p-4 md:p-10 pb-0 lg:pb-10"
      : "p-4 md:p-10"
  } lg:max-w-none mx-auto lg:mx-0`}
>

  {/* MOBILE DASHBOARD */}
  {activeTab === "dashboard" && (
    <div className="lg:hidden pb-8 space-y-4 max-w-[390px] mx-auto overflow-hidden">

      {/* TOP */}
      <div className="flex items-center justify-between pt-1">
        <img
          src="/images/logo.png"
          alt="UpNorth Tech"
          className="h-[54px] w-auto object-contain"
        />

        <div className="flex items-center gap-3">
          <button className="relative text-[18px]">
            🔔
            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>

          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="relative overflow-hidden bg-[#0B1120] border border-white/15 rounded-[24px] p-5 min-h-[190px]">
        <img
          src="/images/rocket.png"
          alt="Rocket"
          className="absolute right-5 top-7 w-[105px] h-[105px] object-contain"
        />

        <p className="text-gray-300 text-[20px] leading-none">
          Welcome back,
        </p>

        <h1 className="text-[39px] leading-none font-black text-orange-500 mt-2">
          Client
        </h1>

        <p className="text-gray-300 text-[14px] mt-3 mb-5 max-w-[210px] break-all">
          {user?.email}
        </p>

        <div className="flex gap-3 relative z-10">
          <a
            href="/request"
            className="bg-orange-500 text-black px-5 py-3 rounded-2xl font-black text-[15px]"
          >
            + New Project
          </a>

          <a
            href="/"
            className="border border-white/20 px-5 py-3 rounded-2xl font-bold text-[15px]"
          >
            🏠 View Home
          </a>
        </div>
      </div>

      {/* OVERVIEW */}
      <div>
        <h2 className="text-[18px] font-black mb-3">
          Overview
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            ["💼", projects.length, "Total Projects", "text-orange-500"],
            ["📈", projects.filter((p) => p.status === "Active").length, "Active Projects", "text-green-400"],
            ["🕘", projects.filter((p) => p.status === "Pending").length, "Pending Requests", "text-orange-400"],
            ["🛡️", projects.filter((p) => p.status === "Delivered").length, "Awaiting Approval", "text-blue-400"],
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveTab("projects")}
              className="bg-[#0B1120] border border-white/15 rounded-[20px] p-4 min-h-[118px] overflow-hidden"
            >
              <div className="text-[20px] mb-1">{item[0]}</div>

              <h3 className={`text-[26px] leading-none font-black ${item[3]}`}>
                {item[1]}
              </h3>

              <p className="text-gray-400 text-[12px] leading-tight mt-1">
                {item[2]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-[18px] font-black mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-4 gap-3">
          {[
            ["＋", "New Request", "/request"],
            ["💬", "Message Admin", "messages"],
            ["🏷️", "View Offers", "offers"],
            ["☁️", "Upload File", "upload"],
          ].map((item, index) =>
            item[2] === "upload" ? (
              <label
                key={index}
                className="bg-[#0B1120] border border-white/15 rounded-[18px] h-[78px] text-center flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="text-[20px] mb-1">{item[0]}</div>
                <p className="text-[10px] font-black leading-tight px-1">{item[1]}</p>
                <input type="file" hidden onChange={handleFileUpload} />
              </label>
            ) : item[2].startsWith("/") ? (
              <a
                key={index}
                href={item[2]}
                className="bg-[#0B1120] border border-white/15 rounded-[18px] h-[78px] text-center flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="text-[20px] mb-1">{item[0]}</div>
                <p className="text-[10px] font-black leading-tight px-1">{item[1]}</p>
              </a>
            ) : (
              <button
                key={index}
                onClick={() => setActiveTab(item[2])}
                className="bg-[#0B1120] border border-white/15 rounded-[18px] h-[78px] text-center flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="text-[20px] mb-1">{item[0]}</div>
                <p className="text-[10px] font-black leading-tight px-1">{item[1]}</p>
              </button>
            )
          )}
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[18px] font-black">
            Recent Projects
          </h2>

          <button
            onClick={() => setActiveTab("projects")}
            className="text-orange-500 font-bold text-[14px]"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="bg-[#0B1120] border border-white/15 rounded-[20px] p-3 flex items-center justify-between gap-3 min-h-[104px] overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-[48px] h-[48px] rounded-2xl bg-purple-500/40 flex items-center justify-center text-[18px]">
                  {project.service?.toLowerCase().includes("web") ? "💻" : "📊"}
                </div>

                <div>
                  <h3 className="text-[16px] leading-tight font-black max-w-[120px] line-clamp-2">
                    {project.service}
                  </h3>

                  <p className="text-gray-400 text-[13px] leading-tight">
                    {project.budget}
                  </p>

                  <p className="text-gray-400 text-[12px] leading-tight">
                    🕒 {project.timeframe}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-bold ${
                    project.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : project.status === "Rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  {project.status}
                </span>

                <button
                  onClick={() => setActiveTab("projects")}
                  className="block mt-2 border border-white/20 px-3 py-1.5 rounded-xl text-[12px]"
                >
                  View Details ›
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )}

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="hidden lg:block">

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
                              onClick={() => rejectProject(project.id)}
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
  <div className="pb-0 lg:pb-0">

    {/* MOBILE PROJECTS VIEW */}
    <div className="lg:hidden max-w-[430px] mx-auto space-y-3 pb-20 overflow-hidden">

      {/* MOBILE TOP */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl"
        >
          ☰
        </button>

        <img
          src="/images/logo.png"
          alt="UpNorth Tech"
          className="h-[54px] w-auto object-contain"
        />

        <div className="relative w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center text-black font-black">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* TITLE */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[34px] leading-tight font-black">
            My Projects
          </h2>
          <p className="text-gray-400 text-sm">
            Manage and track all your projects
          </p>
        </div>

        <a
          href="/request"
          className="bg-orange-500 text-black px-4 py-3 rounded-2xl font-black text-sm whitespace-nowrap"
        >
          + New
        </a>
      </div>

      {/* FILTER TABS */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max bg-[#0B1120] border border-white/10 rounded-3xl p-2">
        {[
          ["All", projects.length],
          ["Active", projects.filter((p) => p.status === "Active").length],
          ["Completed", projects.filter((p) => p.status === "Completed").length],
          ["Pending", projects.filter((p) => p.status === "Pending").length],
          ["Rejected", projects.filter((p) => p.status === "Rejected").length],
        ].map(([label, count]) => (
          <button
            key={label}
            onClick={() => setProjectFilter(label)}
            className={`px-5 py-3 rounded-2xl text-sm font-bold ${
              projectFilter === label
                ? "bg-orange-500 text-black"
                : "text-gray-300"
            }`}
          >
            {label} ({count})
          </button>
        ))}
        </div>
      </div>


      {/* PROJECT CARDS */}
      {projects.length === 0 ? (
        <div className="bg-[#0B1120] border border-white/10 rounded-[28px] p-8 text-center">
          <h3 className="text-2xl font-black mb-3">
            No Projects Yet
          </h3>

          <p className="text-gray-400 mb-6">
            Start your first project request.
          </p>

          <a
            href="/request"
            className="inline-block bg-orange-500 text-black px-6 py-4 rounded-2xl font-black"
          >
            Start Project
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const daysLeft = project.delivery_date
              ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(project.delivery_date) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                )
              : null;

            const progress =
              project.status === "Completed"
                ? 100
                : project.status === "Active"
                ? 70
                : project.status === "Rejected"
                ? 20
                : 0;

            const statusStyle =
              project.status === "Completed"
                ? "bg-green-500/15 text-green-400"
                : project.status === "Rejected"
                ? "bg-red-500/15 text-red-400"
                : project.status === "Active"
                ? "bg-green-500/15 text-green-400"
                : "bg-orange-500/15 text-orange-400";

            return (
              <div
                key={project.id}
                className="bg-[#0B1120] border border-white/10 rounded-[28px] p-5 overflow-hidden"
              >
                {/* CARD HEADER */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-2xl shrink-0">
                      {project.service?.toLowerCase().includes("web")
                        ? "💻"
                        : project.service?.toLowerCase().includes("bot")
                        ? "🤖"
                        : "🚀"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black text-[19px] leading-tight line-clamp-2">
                        {project.service}
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        {project.timeframe}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-2 rounded-2xl text-xs font-black whitespace-nowrap ${statusStyle}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* META GRID */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">
                      Budget
                    </p>
                    <h4 className="text-orange-400 font-black mt-1">
                      {project.budget}
                    </h4>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">
                      Delivery
                    </p>
                    <h4 className="font-black mt-1 text-orange-400">
                      {daysLeft !== null ? `${daysLeft} days left` : "Pending"}
                    </h4>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">
                      Progress
                    </p>
                    <h4 className="font-black mt-1">
                      {progress}%
                    </h4>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">
                      Updated
                    </p>
                    <h4 className="text-gray-300 font-bold mt-1">
                      Recently
                    </h4>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-4">
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-500"
                          : project.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* DETAILS */}
                {project.details && (
                  <p className="text-gray-400 text-sm leading-6 mt-4 line-clamp-2 break-words">
                    {project.details}
                  </p>
                )}

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button className="border border-white/10 rounded-2xl py-3 font-bold text-sm">
                    👁 View Details
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab("messages");
                    }}
                    className="border border-orange-500/50 text-orange-400 rounded-2xl py-3 font-bold text-sm"
                  >
                    💬 Message
                  </button>
                </div>

                {/* DELIVERY ACTION */}
                {project.status === "Delivered" && !project.client_approved && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => approveProject(project.id)}
                      className="bg-green-500 text-black rounded-2xl py-3 font-black text-sm"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => rejectProject(project.id)}
                      className="bg-red-500 text-white rounded-2xl py-3 font-black text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* DESKTOP PROJECTS VIEW - KEEP YOUR OLD TABLE */}
    <div className="hidden lg:block">

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
                  <th className="text-left px-6 py-5">Service</th>
                  <th className="text-left px-6 py-5">Budget</th>
                  <th className="text-left px-6 py-5">Delivery</th>
                  <th className="text-left px-6 py-5">Status</th>
                  <th className="text-left px-6 py-5">Details</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-t border-white/10 hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-6">
                      <h3 className="font-semibold text-lg">
                        {project.service}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {project.timeframe}
                      </p>
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
                              (new Date(project.delivery_date) - new Date()) /
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
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>

  </div>
)}

{/* MESSAGES */}
{activeTab === "messages" && (
  <div className="pb-28 lg:pb-0">

    {/* MOBILE MESSAGE VIEW */}
    <div className="lg:hidden max-w-[430px] mx-auto h-[calc(100vh-105px)] flex flex-col overflow-hidden gap-4">

      {/* MOBILE TOP */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
        >
          ☰
        </button>

        <img
          src="/images/logo.png"
          alt="UpNorth Tech"
          className="h-[54px] w-auto object-contain"
        />

        <div className="flex items-center gap-3">
          <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
            🔔
            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-black">
                {unreadMessages}
              </span>
            )}
          </button>

          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>


      {/* CHAT CARD */}
      <div className="bg-[#0B1120] border border-white/10 rounded-[30px] overflow-hidden flex flex-col flex-1 min-h-0">

        {/* CHAT HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl"
            >
              ←
            </button>

            <div className="relative w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-black font-black">
              U
              <span className="absolute right-0 bottom-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0B1120]"></span>
            </div>

            <div>
              <h3 className="font-black text-lg leading-tight">
                UpNorth Support
              </h3>

              <p className="text-green-400 text-xs font-bold">
                Online
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              ☎
            </button>

            <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              ⋮
            </button>
          </div>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.08),transparent_30%)]">

          <div className="flex justify-center">
            <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">
              Today
            </span>
          </div>

          {messages
            .filter((msg) => !msg.deleted)
            .map((msg) => (
              <div
                id={`message-${msg.id}`}
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === "client"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.sender !== "client" && (
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center text-xs font-black shrink-0 mt-1">
                    U
                  </div>
                )}

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

                    touchTimer.current = setTimeout(() => {
                      setContextMenu({
                        x: touch.clientX,
                        y: touch.clientY,
                        message: msg,
                      });
                    }, 600);
                  }}

                  onTouchEnd={(e) => {
                    clearTimeout(e.currentTarget.dataset.timer);
                  }}
                  className={`max-w-[78%] px-5 py-4 rounded-[22px] break-words ${
                    msg.sender === "client"
                      ? "bg-orange-500 text-black rounded-br-md"
                      : "bg-[#111827] border border-white/10 text-white rounded-bl-md"
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
                      className="mb-3 border-l-4 border-orange-500 bg-black/20 rounded-xl px-3 py-2"
                    >
                      <p className="text-orange-300 text-xs font-bold">
                        Reply
                      </p>

                      <p className="text-xs opacity-80 line-clamp-2">
                        {
                          messages.find(
                            (m) => String(m.id) === String(msg.reply_to)
                          )?.message || "Original message"
                        }
                      </p>
                    </div>
                  )}

                  <p className="font-semibold leading-6">
                    {msg.message}
                  </p>

                  {msg.file_url && (
                    <a
                      href={msg.file_url}
                      target="_blank"
                      className="block mt-3 underline font-black"
                    >
                      📎 {msg.file_name || "Download file"}
                    </a>
                  )}

                  <p className="text-[10px] opacity-60 mt-2 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.sender === "client" ? " ✓✓" : ""}
                  </p>

                  {msg.edited && !msg.deleted && (
                    <p className="text-[10px] opacity-60 mt-1">
                      Edited
                    </p>
                  )}
                </div>
              </div>
            ))}

          <div ref={bottomRef}></div>
        </div>

        {/* QUICK REPLIES */}
        <div className="px-4 py-3 border-t border-white/10 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {["👋 Hi there!", "✅ I am fine", "❓ Need help", "🙏 Thank you"].map(
              (text) => (
                <button
                  key={text}
                  onClick={() => setMessage(text)}
                  className="border border-white/10 bg-white/5 px-4 py-2 rounded-full text-sm font-bold"
                >
                  {text}
                </button>
              )
            )}
          </div>
        </div>

        {/* REPLY BOX */}
        {replyTo && (
          <div className="mx-4 mb-3 bg-[#111827] border border-orange-500/40 rounded-2xl px-4 py-3 flex justify-between gap-3">
            <div>
              <p className="text-orange-400 text-xs font-black">
                Replying to message
              </p>

              <p className="text-gray-300 text-xs line-clamp-1">
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
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2 items-center">
            <label className="w-12 h-12 bg-[#111827] border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer shrink-0">
              📎
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </label>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="min-w-0 flex-1 bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-orange-500 text-sm"
            />

            <button
              onClick={handleSendMessage}
              className="w-14 h-12 bg-orange-500 text-black rounded-2xl font-black shrink-0"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

    </div>

    {/* DESKTOP MESSAGE VIEW - KEEP YOUR CURRENT DESIGN */}
    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">

      {/* CONTACTS */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">


        <div className="px-3 py-2">
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

        <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0">
          {messages
            .filter((msg) => !msg.deleted)
            .map((msg) => (
              <div
                id={`message-${msg.id}`}
                key={msg.id}
                className={`max-w-[75%] break-words ${
                  msg.sender === "client" ? "ml-auto" : ""
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
                  className={`px-6 py-5 rounded-3xl ${
                    msg.sender === "client"
                      ? "bg-orange-500 text-black rounded-tr-md"
                      : "bg-[#0F172A] border border-white/10 rounded-tl-md"
                  }`}
                >
                  <p>{msg.message}</p>

                  {msg.file_url && (
                    <div className="mt-3">
                      {msg.file_type?.startsWith("image/") ? (
                        <a
                          href={msg.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="block"
                        >
                          <img
                            src={msg.file_url}
                            alt={msg.file_name || "Uploaded image"}
                            className="max-w-full max-h-[260px] rounded-2xl border border-black/10 object-cover mb-2"
                          />

                          <span className="underline font-black text-sm">
                            📥 Download image
                          </span>
                        </a>
                      ) : (
                        <a
                          href={msg.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="block underline font-black"
                        >
                          📎 Download {msg.file_name || "file"}
                        </a>
                      )}
                    </div>
                  )}
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

        <div className="border-t border-white/10 p-5 shrink-0">
          <div className="flex gap-3 items-center">
            <label className="bg-[#0F172A] border border-white/10 px-5 py-4 rounded-2xl cursor-pointer">
              📎
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </label>

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

    {/* CONTEXT MENU */}
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
            handleReplyMessage(contextMenu.message);
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
                  handleEditMessage(contextMenu.message);
                  setContextMenu(null);
                }}
                className="w-full text-left px-5 py-3 hover:bg-white/5"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  handleDeleteMessage(contextMenu.message);
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

  </div>
)}

{/* OFFERS */}
{activeTab === "offers" && (
  <div className="pb-0 lg:pb-0">

    {/* MOBILE OFFERS VIEW */}
    <div className="lg:hidden max-w-[430px] mx-auto space-y-4 pb-20">

      {/* MOBILE TOP */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
        >
          ☰
        </button>

        <img
          src="/images/logo.png"
          alt="UpNorth Tech"
          className="h-[54px] w-auto object-contain"
        />

        <div className="flex items-center gap-3">
          <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
            🔔
            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-black">
                {unreadMessages}
              </span>
            )}
          </button>

          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div>
        <p className="text-orange-400 uppercase tracking-[4px] text-xs font-bold mb-2">
          Premium Packages
        </p>

        <h2 className="text-[38px] leading-tight font-black">
          Choose Your Plan
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Select the perfect package to grow your business.
        </p>
      </div>

      {/* STARTER */}
      <div className="bg-[#0B1120] border border-white/10 rounded-[30px] p-5 overflow-hidden">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shrink-0">
            🚀
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start gap-3">
              <p className="text-orange-400 font-black">
                STARTER
              </p>

              <span className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl text-xs font-bold text-gray-300">
                1-2 Weeks
              </span>
            </div>

            <h3 className="text-[38px] leading-tight font-black mt-2">
              $500
            </h3>

            <p className="text-gray-400 text-sm leading-6 mt-2">
              Perfect for landing pages and simple business websites.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-5">
          <p>✓ Responsive Website</p>
          <p>✓ Contact Form</p>
          <p>✓ Modern UI Design</p>
          <p>✓ Mobile Optimization</p>
        </div>

        <button
          onClick={() => handleChoosePlan("Starter")}
          className="w-full border border-orange-500 text-orange-400 py-4 rounded-2xl font-black"
        >
          Choose Starter →
        </button>
      </div>

      {/* PREMIUM */}
      <div className="relative bg-gradient-to-br from-orange-500 to-[#FF7A18] text-black rounded-[34px] p-5 overflow-hidden shadow-2xl shadow-orange-500/20">
        <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xs font-black">
          MOST POPULAR
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-3xl bg-black/10 border border-black/10 flex items-center justify-center text-4xl shrink-0">
            👑
          </div>

          <div className="flex-1 pt-8">
            <p className="font-black">
              PREMIUM
            </p>

            <h3 className="text-[40px] leading-tight font-black mt-2">
              $2,500
            </h3>

            <p className="text-black/75 text-sm leading-6 mt-2">
              Best for scalable platforms, dashboards and automation systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-5 font-semibold">
          <p>✓ Full Stack Web App</p>
          <p>✓ API Integration</p>
          <p>✓ Dashboard System</p>
          <p>✓ Priority Support</p>
          <p>✓ Authentication</p>
        </div>

        <button
          onClick={() => handleChoosePlan("Premium")}
          className="w-full bg-black text-white py-4 rounded-2xl font-black"
        >
          Choose Premium →
        </button>
      </div>

      {/* ENTERPRISE */}
      <div className="bg-[#0B1120] border border-blue-500/30 rounded-[30px] p-5 overflow-hidden">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-4xl shrink-0">
            🏢
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start gap-3">
              <p className="text-blue-400 font-black">
                ENTERPRISE
              </p>

              <span className="bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-2xl text-xs font-bold text-blue-400">
                Custom
              </span>
            </div>

            <h3 className="text-[38px] leading-tight font-black mt-2">
              Custom
            </h3>

            <p className="text-gray-400 text-sm leading-6 mt-2">
              Advanced infrastructure for large businesses and SaaS platforms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-5">
          <p>✓ Custom Architecture</p>
          <p>✓ Dedicated Support</p>
          <p>✓ AI Automation</p>
          <p>✓ Unlimited Scaling</p>
          <p>✓ Trading Systems</p>
        </div>

        <button
          onClick={() => handleChoosePlan("Enterprise")}
          className="w-full border border-blue-500/50 text-blue-400 py-4 rounded-2xl font-black"
        >
          Contact Enterprise →
        </button>
      </div>
    </div>

    {/* DESKTOP OFFERS VIEW */}
    <div className="hidden lg:block space-y-10">
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
    <p className="text-orange-400 font-bold mb-4">STARTER</p>
    <h3 className="text-5xl font-black mb-2">$500</h3>
    <p className="text-gray-400 mb-8">
      Perfect for landing pages and simple business websites.
    </p>

    <div className="space-y-2 mb-10 text-gray-300">
      <p>✔ Responsive Website</p>
      <p>✔ Modern UI Design</p>
      <p>✔ Contact Form</p>
      <p>✔ Mobile Optimization</p>
    </div>

    <button
      onClick={() => handleChoosePlan("Starter")}
      className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black"
    >
      Choose Starter
    </button>
  </div>

  {/* PREMIUM */}
  <div className="relative bg-orange-500 text-black rounded-[40px] p-8 scale-[1.03] shadow-2xl shadow-orange-500/20">
    <div className="absolute top-5 right-5 bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
      MOST POPULAR
    </div>

    <p className="font-bold mb-4">PREMIUM</p>
    <h3 className="text-5xl font-black mb-2">$2,500</h3>
    <p className="mb-8 opacity-80">
      Best for scalable platforms, dashboards and automation systems.
    </p>

    <div className="space-y-2 mb-10">
      <p>✔ Full Stack Web App</p>
      <p>✔ Dashboard System</p>
      <p>✔ Authentication</p>
      <p>✔ API Integration</p>
      <p>✔ Priority Support</p>
    </div>

    <button
      onClick={() => handleChoosePlan("Premium")}
      className="w-full bg-black text-white py-5 rounded-2xl font-black"
    >
      Choose Premium
    </button>
  </div>

  {/* ENTERPRISE */}
  <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 hover:border-orange-500 transition">
    <p className="text-orange-400 font-bold mb-4">ENTERPRISE</p>
    <h3 className="text-5xl font-black mb-2">Custom</h3>
    <p className="text-gray-400 mb-8">
      Advanced infrastructure for large businesses and SaaS platforms.
    </p>

    <div className="space-y-2 mb-10 text-gray-300">
      <p>✔ Custom Architecture</p>
      <p>✔ AI Automation</p>
      <p>✔ Trading Systems</p>
      <p>✔ Dedicated Support</p>
      <p>✔ Unlimited Scaling</p>
    </div>

    <button
      onClick={() => handleChoosePlan("Enterprise")}
      className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black"
    >
      Contact Enterprise
    </button>
  </div>

</div>
    </div>

  </div>
)}

{/* PROFILE */}
{activeTab === "profile" && (
  <div className="pb-0 lg:pb-0">

    {/* MOBILE PROFILE VIEW */}
    <div className="lg:hidden max-w-[430px] mx-auto space-y-5 pb-20">

      {/* MOBILE TOP */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
        >
          ☰
        </button>

        <img
          src="/images/logo.png"
          alt="UpNorth Tech"
          className="h-[54px] w-auto object-contain"
        />

        <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
          🔔
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-black">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* WELCOME */}
      <div>
        <h2 className="text-[34px] leading-tight font-black">
          Welcome, <span className="text-orange-500">Client</span>
        </h2>

        <p className="text-gray-400 text-sm break-all mt-1">
          {user?.email}
        </p>
      </div>

      {/* PROFILE HERO */}
      <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[32px] p-6">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,115,0,0.18),transparent_35%)]"></div>

        <div className="relative z-10">

          <div className="flex items-center gap-5 mb-6">
            <div className="w-28 h-28 rounded-full bg-orange-500 flex items-center justify-center text-black text-5xl font-black border-4 border-white/10 shadow-2xl">
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="uppercase tracking-[4px] text-orange-400 text-xs font-bold mb-2">
                Client Account
              </p>

              <h3 className="text-[34px] leading-tight font-black truncate">
                {user?.user_metadata?.full_name || "Client"}
              </h3>

              <p className="text-gray-400 text-sm break-all mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-3">
              <p className="text-gray-400 text-[11px]">Status</p>
              <h4 className="text-green-400 font-black text-sm">Active</h4>
            </div>

            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-3">
              <p className="text-gray-400 text-[11px]">Projects</p>
              <h4 className="text-orange-400 font-black text-sm">
                {projects.length}
              </h4>
            </div>

            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-3">
              <p className="text-gray-400 text-[11px]">Member</p>
              <h4 className="font-black text-sm">Premium</h4>
            </div>
          </div>

          <button
            onClick={() => setEditingProfile(true)}
            className="w-full bg-orange-500 text-black py-4 rounded-2xl font-black mb-3"
          >
            ✎ Edit Profile
          </button>

          <button className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-black">
            🔒 Change Password
          </button>

        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white/5 border border-white/10 rounded-[30px] p-5">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-black">Personal Info</h3>

          <div className="w-11 h-11 rounded-2xl bg-orange-500 text-black flex items-center justify-center font-black">
            P
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Full Name</p>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-4 py-4 font-bold">
              {user?.user_metadata?.full_name || "Client"}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Email Address</p>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-4 py-4 font-bold break-all">
              {user?.email}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Account Type</p>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-4 py-4 font-bold">
              Client Dashboard Access
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="bg-white/5 border border-white/10 rounded-[30px] p-5">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-black">Activity</h3>

          <div className="w-11 h-11 rounded-2xl bg-orange-500 text-black flex items-center justify-center font-black">
            A
          </div>
        </div>

        <div className="space-y-3">
          {[
            ["Projects Submitted", projects.length, "Total projects requested from dashboard."],
            ["Active Requests", projects.filter((p) => p.status === "Active").length, "Projects currently in development."],
            ["Pending Requests", projects.filter((p) => p.status === "Pending").length, "Waiting for approval or review."],
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#0F172A] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-black">{item[0]}</h4>
                <p className="text-gray-400 text-sm mt-1">{item[2]}</p>
              </div>

              <span className="text-orange-400 text-2xl font-black">
                {item[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>

    {/* DESKTOP PROFILE VIEW */}
    <div className="hidden lg:block space-y-8">

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
{/* MOBILE BOTTOM NAV */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1120]/95 backdrop-blur-xl border border-white/10 rounded-t-[24px] px-4 pt-2 pb-2">
  <div className="grid grid-cols-5 text-center text-gray-400">

    <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "text-orange-500" : ""}>
      <div className="text-[18px]">⌂</div>
      <p className="text-[11px]">Dashboard</p>
    </button>

    <button onClick={() => setActiveTab("projects")} className={activeTab === "projects" ? "text-orange-500" : ""}>
      <div className="text-[18px]">▣</div>
      <p className="text-[11px]">Projects</p>
    </button>

    <button onClick={() => setActiveTab("messages")} className={activeTab === "messages" ? "text-orange-500 relative" : "relative"}>
      <div className="text-[18px]">☵</div>
      <p className="text-[11px]">Messages</p>
      {unreadMessages > 0 && (
        <span className="absolute top-0 right-6 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full">
          {unreadMessages}
        </span>
      )}
    </button>

    <button onClick={() => setActiveTab("offers")} className={activeTab === "offers" ? "text-orange-500" : ""}>
      <div className="text-[18px]">◇</div>
      <p className="text-[11px]">Offers</p>
    </button>

    <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "text-orange-500" : ""}>
      <div className="text-[18px]">♙</div>
      <p className="text-[11px]">Profile</p>
    </button>

  </div>
</div>

    </main>

  );

}