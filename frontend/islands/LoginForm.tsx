import { useState } from "preact/hooks";
import { Lock, LogIn, User } from "lucide-preact";

export const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        console.log("Login attempted with:", { username, password });
    };

    return (
        <form class="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor="username"
                    class="block text-sm font-medium text-gray-700"
                >
                    Username
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        class="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername((e.target as HTMLInputElement).value)}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="password"
                    class="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        class="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword((e.target as HTMLInputElement).value)}
                    />
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label
                        htmlFor="remember-me"
                        class="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                </div>

                <div class="text-sm">
                    <a
                        href="#"
                        class="font-medium text-black hover:text-gray-800"
                    >
                        Forgot your password?
                    </a>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    <LogIn class="h-5 w-5 mr-2" />
                    Sign in
                </button>
            </div>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        class="font-medium text-black hover:text-gray-800"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </form>
    );
};
