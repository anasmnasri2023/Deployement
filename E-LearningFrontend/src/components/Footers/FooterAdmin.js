import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="block py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-gray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            
            {/* Copyright */}
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-gray-600 font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
                <span className="text-indigo-600 font-bold">
                  E-Learning Language Platform 
                </span>
                . All rights reserved.
              </div>
            </div>

            {/* Links */}
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end justify-center">
                <li>
                  <a
                    href="/admin/dashboard"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-semibold block py-1 px-3"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-semibold block py-1 px-3"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-semibold block py-1 px-3"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-semibold block py-1 px-3"
                  >
                    Terms & Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/anasmnasri2023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 text-sm font-semibold block py-1 px-3"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
