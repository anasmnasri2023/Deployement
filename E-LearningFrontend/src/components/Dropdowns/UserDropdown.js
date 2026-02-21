import React from "react";
import { createPopper } from "@popperjs/core";

const UserDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleLogout = () => {
    // Clear any stored user data/tokens here if needed
    // localStorage.removeItem('token');
    // sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = "http://localhost:3000/auth/login";
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    closeDropdownPopover();
    // Navigate to profile page
    window.location.href = "http://localhost:3000/profile";
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    closeDropdownPopover();
    // Navigate to settings page
    window.location.href = "http://localhost:3000/admin/settings";
  };

  const handleAccountClick = (e) => {
    e.preventDefault();
    closeDropdownPopover();
    // Add account navigation logic here
    console.log("Navigate to account");
  };

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="User Profile"
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={require("assets/img/team-1-800x800.jpg").default}
            />
          </span>
        </div>
      </a>
      
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          href="#pablo"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-100"
          onClick={handleProfileClick}
        >
          <i className="fas fa-user mr-2 text-sm"></i>
          Profile
        </a>
        
        <a
          href="#pablo"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-100"
          onClick={handleAccountClick}
        >
          <i className="fas fa-user-circle mr-2 text-sm"></i>
          Account Settings
        </a>
        
        <a
          href="#pablo"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-100"
          onClick={handleSettingsClick}
        >
          <i className="fas fa-cog mr-2 text-sm"></i>
          Settings
        </a>
        
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        
        <a
          href="#pablo"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-red-600 hover:bg-red-50"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <i className="fas fa-sign-out-alt mr-2 text-sm"></i>
          Log Out
        </a>
      </div>
    </>
  );
};

export default UserDropdown;