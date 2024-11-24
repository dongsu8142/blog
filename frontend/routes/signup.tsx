import { define, State } from "@/utils.ts";
import { FreshContext } from "fresh";
import { SignupForm } from "@/islands/SignupForm.tsx";

export default define.page(() => {
    return (
        <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <div class="absolute top-4 left-4">
                <a
                    href="/"
                    class="flex items-center text-black hover:text-gray-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Home
                </a>
            </div>
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    class="mx-auto h-12 w-auto"
                    src="/logo.svg"
                    alt="Blog Logo"
                />
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
});

export const handler = {
    GET(ctx: FreshContext<State>) {
        ctx.state.title = "Sign Up - Blog";
    },
};
