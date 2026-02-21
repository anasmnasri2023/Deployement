import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Chatbot from "views/admin/Chatbot.js"; // Ajout du composant Chatbot

// Views
import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";
import Users from "views/admin/Users.js";
import Courses from "views/admin/Courses.js";
import Bookings from "views/admin/Bookings.js";
import Kanban from "views/admin/Kanban.js";
import Chat from "views/admin/Chat.js";
import Payment from "views/admin/Payment.js"; 
import Reviews from "views/admin/Reviews.js";

export default function Admin() {
  const location = useLocation();

  return (
    <>
      <Sidebar />

      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen flex flex-col">
        <AdminNavbar />

        {/* Header minimisé, excluded for /admin/chat */}
        {location.pathname !== "/admin/chat" && (
          <div className="px-4 md:px-6 pb-2">
            <HeaderStats />
          </div>
        )}

        {/* Contenu principal agrandi */}
        <div className="flex-grow px-4 md:px-6 mx-auto w-full">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/users" exact component={Users} />
            <Route path="/admin/courses" exact component={Courses} />
            <Route path="/admin/bookings" exact component={Bookings} />
            <Route path="/admin/kanban" exact component={Kanban} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/payments" exact component={Payment} />
            <Route path="/admin/reviews" exact component={Reviews} />

            <Route
              path="/admin/chat"
              exact
              render={() => (
                <div className="w-full h-full">
                  <Chat />
                </div>
              )}
            />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>

        {/* Chatbot */}
        <Chatbot />

        <FooterAdmin />
      </div>
    </>
  );
}