import { useState } from "preact/hooks";
import { LogIn, PenSquare, User, Settings, LogOut } from "lucide-preact";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-semibold text-gray-800">Blog</a>
          </div>
          <div class="flex items-center">
            {isLoggedIn ? (
              <>
                <button class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PenSquare class="h-5 w-5 mr-2" />
                  포스팅
                </button>
                <div class="relative ml-3">
                  <button
                    onClick={toggleDropdown}
                    class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <img
                      class="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="User avatar"
                    />
                  </button>
                  {isDropdownOpen && (
                    <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <a href="#" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User class="h-5 w-5 mr-2" /> 내 프로필
                      </a>
                      <a href="#" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings class="h-5 w-5 mr-2" /> 설정
                      </a>
                      <a href="#" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsLoggedIn(false)}>
                        <LogOut class="h-5 w-5 mr-2" /> 로그아웃
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsLoggedIn(true)}
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <LogIn class="h-5 w-5 mr-2" />
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}