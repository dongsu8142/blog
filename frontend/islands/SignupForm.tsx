import { useState } from "preact/hooks";
import { Lock, LogIn, Mail, User } from "lucide-preact";

export const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        // Here you would typically handle the signup logic
        console.log("Signup attempted with:", { email, username, password });
    };

    return (
        <form class="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor="email"
                    class="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        class="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) =>
                            setEmail((e.target as HTMLInputElement).value)}
                    />
                </div>
            </div>

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

            <div>
                <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    <LogIn class="h-5 w-5 mr-2" />
                    Sign up
                </button>
            </div>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        class="font-medium text-black hover:text-gray-800"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </form>
    );
};
